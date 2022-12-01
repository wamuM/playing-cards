import random from "../tools/random.js"
class Game{
    /**
     * The game object that encapsulates all players and game logic
     * @param {String} name The name of the game
     */
    constructor(name){
        this.name = name
        this.players = new Map();
        this.matches = new Map();
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
        this.matches.set(code,match)
        return match
    }
    async listenAt(options){
        for await(ws of serveWebSocket(listener,options)){
            const player = await this._waitForConnection(ws)
            this.players.set(player.token,player)
        }
    }
    _waitForConnection(ws){
        return Promise((resolve,reject)=>{
            ws.onmessage = (messageEvent)=>{
                const data = messageEvent.data.split("\r\n")
                const [verb,_promiseIdentifier,token] = data[0].split(" ")
                if(verb == "CONNECT"){
                    if(token){
                        const player = Game.players.get(token)
                        if(player == undefined){
                            ws.close(4403,"Forbidden")
                            reject("Wrong token")
                        }
                        resolve(player)
                    }else{
                        let token;
                        do{
                            token = random.string("QWERTYUIOPASDFGHJKLZXCVBNM_.,-123456789qwertyuiopasdfghjklzxcvbnm+",10)
                        }while(this.players.get(token))
                        resolve(new ServerSidePlayer(ws,token))
                    }
                }else{
                    ws.close(4405,"The first request should always be CONNECT")
                }
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
        this.ws.send(`TOKEN ${token}`)//sends the auth token to the player
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
    constructor(admin,code){
        this.code = code
        this.admin = admin 
        this.admin.ws.send(`JOINED ${code} ADMIN`)
        this.players = new Set();
    }
    join(player){
        this.players.add(player)
    }
}

async function serveWebSocket(listener,options){
    const connection = listener||Deno.listen(options)
    const http = Deno.serveHttp(await connection.accept())
    return {
        next(){
            return new Promise(function promiseHandler(resolve,reject){
                    http.nextRequest().then((request)=>{
                        if(req.headers.get("upgrader") != "WebSocket"){
                            req.respondWith(new Response(null,{status:501}))
                            return promiseHandler(resolve,reject)
                        }else{
                            req.respondWith(response)
                            const {socket:ws, response} = Deno.upgradeWebSocket(request)
                            resolve({done:false,value:ws})
                        }
                    }).catch((err)=>{
                        reject(err)
                    })
                })
        },
        [Symbol.asyncIterator](){
            return this;
        }
    }
}


export default {Game,ServerSidePlayer,Match,serveWebSocket}
