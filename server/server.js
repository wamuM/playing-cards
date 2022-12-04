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
    /**
     * Listens 
     * @param {Deno.TcpListenOptions} options The connection options ()
     */
    async listen(options){
        for await(const connection of Deno.listen(options)){
            const httpConn = Deno.serveHttp(connection)
            console.log("<=====================>")
            console.log(httpConn)
            console.log(connection)
            for await(const requestEvent of serve(httpConn)){
                //Process url
                if(requestEvent == null)return;
                const url = new URL(requestEvent.request.url);
                let filepath = decodeURIComponent(url.pathname);
                if(!options.url)options.url = "/";

                if(requestEvent.request.headers.get("upgrade") == "websocket"){//Upgrade to websocket
                    console.log(requestEvent.request)
                    console.log("test")
                    if(!filepath.startsWith(options.url))return;//filters out other url requests
                    const {socket,response} = Deno.upgradeWebSocket(requestEvent.request)
                    await requestEvent.respondWith(response)
                    const player = await this._waitForConnection(socket)
                    this.players.set(player.token,player)
                }else{//Normal HTTP File Server
                    let file;
                    filepath = filepath.slice(options.url.length)
                    try{
                        switch(filepath){
                            case "":
                                filepath = "/../UI/index.html";
                            break;
                            case "script.js":
                                filepath = "/../UI/script.js";
                            break;
                            case "style.css":
                                filepath = "/../UI/style.css";
                            break;
                            default:
                                filepath = "/../UI/index.html";
                            break;
                        }
                        filepath = new URL(import.meta.url+"/.."+filepath+"?name="+this.name);
                        file = await Deno.open(filepath,{read:true})
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

function serve(httpConn){
    return {
        next(){
            return new Promise((resolve,reject)=>{
                httpConn.nextRequest().then((requestEvent)=>{
                    resolve({done:false,value:requestEvent})
                }).catch(err=>reject(err))
            })
        },
        [Symbol.asyncIterator](){
            return this;
        }
    }
}


export default {Game,ServerSidePlayer,Match}
