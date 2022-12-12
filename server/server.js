/**
 * Server related module
 * @module server
 */

import random from "../tools/random.js"
import eventHandler from "./eventHandler.js";
import httpFileServer from "./httpfileserver.js"
import {CartesianEncapsulator,Board} from "../game/cartesianComponents.js"
/**
 * The game object that encapsulates all players and game logic
 */
class Game{//!  MAIN CLASS
    /**
     * Creates a Game instance
     * @param {String} name The name of the game
     * @param {gameSettings} [defaultSettings] Optional settings for all matches
     */
    constructor(name,defaultSettings={}){
        /**The name of the game */
        this.name = name
        this.players = new Collection("token");
        //? This lets you access the game a player is in within the player scope
        this.players._addModifier = (_col,plr)=>plr.game = this;
        this.matches = new Collection("code");
        this.settings = defaultSettings
    }
    /**
     * Sets the event listeners of the specified event
     * @param {String} eventName The name of the event
     * @param {Function} eventListener The event handler
     * @see {@tutorial userEvents|List of all possible events}
     */
    addEventListener(eventName,eventListener){
        this["on"+eventName] = eventListener
    }
    /**
     * Generates a match with it's code and it's admin player
     * @param {ServerSidePlayer} player The player that has created the game
     * @returns {Match} The spawned match
     */
    spawnMatch(player){
        let code;
        do{
            code = random.string("QWERTYUIOASDFGHJKLZXCVBNM1234567890",5)
        }
        while(this.matches.get(code))
            
        const match = new Match(player,code)
        this.matches.add(match)
        return match
    }
    /**
     * Servers the game at the specified port and url 
     * @param {ExtendedDenoTcpListenOptions} options The connection options
     */
    async listen(options){
        console.log("Playing Cards Listening with options: "+JSON.stringify(options))
        for await (const connection of Deno.listen(options)){
            (async()=>{
                http: for await (const requestEvent of Deno.serveHttp(connection)){
                    //Filter urls
                    const url = new URL(requestEvent.request.url)
                    let path = url.pathname
                    if(!options.url)options.url = "/";
                    if(!path.startsWith(options.url))continue http;
                    path = path.slice(options.url.length)

                    //Serve http file server if normal
                    if(!(requestEvent.request.headers.get("upgrade") == "websocket")){
                        await httpFileServer(path,requestEvent)
                        continue http
                    }
                    //Upgrade if websocket
                    const {socket,response} = Deno.upgradeWebSocket(requestEvent.request)
                                   await requestEvent.respondWith(response)
                    try{
                        const player = await this._waitForConnection(socket)
                        player.send("NAME",this.name)
                        this.onconnect?.(player)
                        this.players.add(player)
                    }catch(error){
                        try{
                            await requestEvent.respondWith(new Response(error,{status:400}))
                        }catch{
                            void undefined //couldn't answer because something already answered
                        }
                    }
                }
            })();
        }
    }
    /**
     * Creates a promise that will be resolved once the client has connected 
     * @param {WebSocket} ws The websokcet the client will connect with
     * @returns {Promise} A promise to the ServerSidePlayer
     * @resolve ServerSidePlayer
     * @reject Error
     */
    _waitForConnection(ws){
        return new Promise((resolve,reject)=>{
            ws.onmessage = (messageEvent)=>{
                const data = messageEvent.data.split("\r\n")
                let [verb,token] = data[0].split(" ")
                let player = this.players.get(token)
                if(player && !player?.ws)player.connect(ws)
                if(player?.ws)return resolve(player)
                if(verb != "CONNECT")return ws.close(4405,"The first request should always be CONNECT")
                if(token){//&& !player
                    ws.close(4403,"Forbidden: Wrong token")
                    reject("Wrong token")
                    return;
                }
                do{
                    token = random.string("QWERTYUIOPASDFGHJKLZXCVBNM_.,-123456789qwertyuiopasdfghjklzxcvbnm+",10)
                }while(this.players.get(token))
                player = new ServerSidePlayer(ws,token)
                this.onjoin?.(player)
                resolve(player)
            }
        })
    }

}



/**
 * Represents the player and the WebSocket that links it with the server
 */
class ServerSidePlayer{
    /**
     * Creates a ServerSidePlayer linked to a ws
     * @param {WebSocket} ws The WebSocket linked with the player
     */
    constructor(ws,token){
        this.ws = ws;
        this.ws.onclose = ()=>{
            this.disconnect(1006)
        }
        this.token = token;
        this.send("TOKEN",this.token) //sends the auth token to the player
        this.ws.onmessage =(messageEvent)=>{this._onmessage(messageEvent)}
        this.promises = new Map()
        this.matches = false;
        this.code = false;
        this.game = false;
    }
    /**
     * Disconects the WebSocket
     * @param {Number} [code] The CloseEvent code (from 4000 to 4999, HTTP Error codes will be used)
     * @param {String} [reason] The CloseEvent reason
     * @see {@tutorial errorCodes| List of CloseEvent codes} 
    */
    disconnect(code,reason){
        this.ws?.close(code,reason)
        this.ws = null 
    }
    /**
     * Connects the ServerSidePlayer to a websocket
     * @param {WebSocket} ws The websocket to be connected to
     */
    connect(ws){
        this.ws = ws
        if(this.match){
            this.send("JOINED",[this.match.code,this.nickname,this.match.admin.token==this.token?"isAdmin=true":undefined])
            this.match.sendAll("NEWPLAYER",this.nickname)
            if(this.match.hasStarted){
                this.send("START")
                this.send("BOARD",JSON.stringify(this.match.board))
            }
        }
        this.ws.onmessage =(messageEvent)=>{this._onmessage(messageEvent)}
    }
    get connected(){return this.ws==null?false:this.ws.readyState==1}
    /**
     * Checks if the token authorises to be this player
     * @param {String} token The player auth token
     * @returns {Boolean} if the player was authorised 
     */
    auth(token){
        return token==this.token
    }
    /**
     * Listens to message events, requests sent by the player
     * @param {MessageEvent} messageEvent The message event
     * @see {@tutorial WebSocketVerbs| List of all possible requests and replies}
     */
    _onmessage(messageEvent){
        eventHandler(this,messageEvent)
    }
    /**
     * Sends a request to the ClientSidePlayer
     * @param {String} verb The request verb (see {@tutorial webSocketVerbs| list of verbs})
     * @param {String} body The request body
     * @param {String} [promiseIdentifier] someting to uniquely identify the request so the client can send a reply
     * @returns {Promise} Returns a promise if promiseIdentifier was set that will resolved once the client replies
     * @see protocole
     */
    send(verb,body,promiseIdentifier=false){
        let str = verb
        if(!(body instanceof Array))body = [body];
        if(promiseIdentifier)str += " "+promiseIdentifier
        str += "\r\n"+body.join("\r\n")
        this.ws.send(str)
        if(promiseIdentifier){
            const promise = new Promise((resolve,reject)=>{
                this.promises.set(promiseIdentifier,{resolve,reject})
            })
            return promise
        }
        
    }
}


/**
 * A match (room) in which a game is played 
 */
class Match{
    /**
     * Creates a match
     * @param {ServerSidePlayer} admin The admin of the match
     * @param {String} code The match code
     */
    constructor(admin,code){
        this.board = new Board()
        this.code = code
        this.players = new Collection("token")
        //? This lets you access the match within the player scope
        this.players._addModifier = (_col,plr)=>plr.match = this;
        this.admin = admin 
        this.bannedTokens = new Set()
        this.join(admin)
    }
    join(player){
        player.nickname = "player"+this.players.size
        this.players.add(player)
    }
    /**
     * Sends a request to all clients within the match 
     * @param {String} verb The request verb (see {@tutorial webSocketVerbs| list of verbs})
     * @param {String} body The request body
     * @param {String} [promiseIdentifier] someting to uniquely identify the request so the client can send a reply
     * @returns {Array<Promise>} Returns a promise if promiseIdentifier was set that will resolved once the client replies
     * @see protocole
     * @see ServerSidePlayer.send
     */
    sendAll(verb,body,promiseIdentifier){
        const promises = []
        this.players.forEach(plr=>{
            const promise = plr.send(verb,body,promiseIdentifier)
            if(promise)promises.push(promise)
        })
        if(promises.length!=0)return promises
    }
    place(element,x,y){
        this.board.place(element,x,y)
        this.sendAll("UPDATE",["Place",JSON.stringify(this.board)])
    }
    replace(element){
        this.board[element.id] = element;
        this.sendAll("UPDATE",["Modify",JSON.stringify(element),index])
    }
    modify(element,fn){
        this.replace(element.id,fn(this.board[index]))
    }
    remove(element){
        const index = element.id
        this.sendAll("UPDATE",["Delete",{},index])
        this.board.forEach((_element,i)=>{
            if(i>=index){
                this.board[index].id = index-1
                this.board[index].trueObject.id = index-1
            }
        })
    }
}


/**
 * A Map of elements that uses a common attribute as a key (i.e Players mapped by their token, Matches mapped by their code, etc )
 */
class Collection extends Map{
    /**
     * @param {String} idKeyName The name of the attribute
     * @param  {...any} args The arguments of the Map constructor
     */
    constructor(idKeyName,...args){
        super(...args)
        this.idKeyName = idKeyName
    }
    /**
     *  Adds an element to the collection using it's this.idKeyName attribute as a key (may overwrite an element with the same key)
     * @param {*} element The element to be added 
     */
    add(element){
        this._addModifier?.(this,element)
        this.set(element[this.idKeyName],element)
    }
    static add(collection,element){
        collection.set(element[collection.idKeyName],element)
    }
    /**
     * Gets the element from the collection (but unlike get, it returns errorValue if the this.idKeyName attribute is no longer equal to the key)
     * @param {*} key The key of the element
     * @param {*} [errorValue] The value that will be returned if an error is encountered (defaults to undefined)
     * @returns {*} The corresponding element
     */
    take(key,errorValue=undefined){
       let element = this.get(key)
       if(!element)return errorValue;
       if(element[this.idKeyName] == key)return element;
       return errorValue 
    }
}


export default {Game,ServerSidePlayer,Match}

/**
 * Deno.TcpListenOptions with extra attributes
 * @typedef {Deno.TcpListenOptions} ExtendedDenoTcpListenOptions
 * @property {String} url A base url (i.e "/playing-cards" for localhost:8080/playing-cards), defaults to "/"
 */

//todo Finnish this
/**
 * Settings for a match
 * @typedef {gameSettings} 
 * @property 
 */