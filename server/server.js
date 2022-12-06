import random from "../tools/random.js"
class Game{
    /**
     * The game object that encapsulates all players and game logic
     * @param {String} name The name of the game
     */
    constructor(name){
        this.name = name
        this.players = new Collection("token");
        this.matches = new Collection("code");
    }
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
        for await (const connection of Deno.listen(options)){
            http: for await (const requestEvent of Deno.serveHttp(connection)){
                //Filter urls
                const url = new URL(requestEvent.request.url)
                let path = url.pathname
                if(!options.url)options.url = "/";
                if(!path.startsWith(options.url))continue http;

                //Upgrade to WebSocket
                if(requestEvent.request.headers.get("upgrade") == "websocket"){
                    const {socket,response} = Deno.upgradeWebSocket(requestEvent.request)
                    await requestEvent.respondWith(response)
                    const player = await this._waitForConnection(socket)
                    this.onconnect?.(player)
                    this.players.add(player)
                }else{
                //HTTP File Server   
                    let file;
                    path = path.slice(options.url.length)
                    try{
                        switch(path){
                            case "script.js":
                                path = "/../UI/script.js";
                            break;
                            case "style.css":
                                path = "/../UI/style.css";
                            break;
                            case "":
                            default:
                                path = "/../UI/index.html";
                            break;
                        }
                        path = new URL(import.meta.url+"/.."+path+"?name="+this.name);
                        file = await Deno.open(path,{read:true})
                        await requestEvent.respondWith(new Response(file.readable));
                    }catch{
                        await requestEvent.respondWith(new Response("404 Not Found",{status:404}));
                    }
                }
              }
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
                const [verb,token] = data[0].split(" ")
                if(verb != "CONNECT")return ws.close(4405,"The first request should always be CONNECT")
                let player = this.player.get(token)
                if(player)return resolve(player)
                if(token){//&& !player
                    ws.close(4403,"Forbidden")
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
class ServerSidePlayer{
    /**
     * Represents the player and the WebSocket that links it with the server
     * @param {WebSocket} ws The WebSocket with the player
     */
    constructor(ws,token){
        this.ws = ws;
        this.token = token;
        this.send("TOKEN",this.token) //sends the auth token to the player
        this.ws.onmessage = this._onmessage
    }
    /**
     * Disconects the WebSocket
     * @param {Number} [code] The CloseEvent code (from 4000 to 4999, HTTP Error codes will be used)
     * @param {String} [reason] The CloseEvent reason
     * @see {@tutorial errorCodes| List of CloseEvent codes} 
    */
    disconnect(code,reason){
        try{
            this.ws.close(code,reason)
        }
        finally{
            this.ws = null 
        }
    }
    /**
     * Connects the ServerSidePlayer to a websocket
     * @param {WebSocket} ws The websocket to be connected to
     */
    connect(ws){
        this.ws = ws
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
        const data = messageEvent.data.split("\r\n")
        const [verb,token,_promiseIdentifier] = data[0].split(" ")

        if(!token)this.disconnect(4401,"Unauthorized")
        if(!this.auth(token))this.disconnect("4403","Forbidden")
        if(this.promises.get(_promiseIdentifier))this.promises.get(_promiseIdentifier).resolve(data)
        switch(verb){
            case "":
            break;
            default:
                this.disconnect(4406,"Unknown webSocket verb")
            break;
        }
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
class Match{
    /**
     * A match
     * @param {ServerSidePlayer} admin The admin of the match
     * @param {String} code The match code
     */
    constructor(admin,code){
        this.code = code
        this.admin = admin 
        this.admin.send("JOINED",[code,"isAdmin=true"])
        this.players = new Set();
    }
    join(player){
        this.players.add(player)
        this.player.send("JOINED",this.code)
    }
}
class Collection extends Map{
    /**
     * A Map of elements that uses a common attribute as a key (i.e Players mapped by their token, Matches mapped by their code, etc )
     * @param {String} idKeyName The name of the attribute
     * @param  {...any} args The arguments of the Map constructor
     */
    constructor(idKeyName,...args){
        super(...args)
        this.idKeyName = idKeyName
    }
    add(element){
        this.set(element[this.idKeyName],element)
    }
    static add(collection,element){
        collection.set(element[collection.idKeyName],element)
    }
}
export default {Game,ServerSidePlayer,Match}

/**
 * Deno.TcpListenOptions with extra attributes
 * @typedef {Deno.TcpListenOptions} ExtendedDenoTcpListenOptions
 * @property {String} url A base url (i.e "/playing-cards" for localhost:8080/playing-cards), defaults to "/"
 */
