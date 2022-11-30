import random from "../tools/random.js"
class Game{
    constructor(name){

    }
    spawnMatch(player){
        let code = random.string("QWERTYUIOASDFGHJKLZXCVBNM1234567890",5)
        let match = new Match(code,player)
        return match
    }
}
class ServerSidePlayer{
    constructor(ws){
        this.ws = ws;
        this.token = random.string("QWERTYUIOPASDFGHJKLZXCVBNM_.,-123456789qwertyuiopasdfghjklzxcvbnm+",10)
        this.connected = true
        this._connectionPromise = null
        this.ws.send(`TOKEN ${token}`)//sends the auth token to the player
        this.ws.on("message",this._onMessage)
    }
    disconnect(){
        this.ws.close()
        this.ws = null 
        this.connected = false;
    }
    checkConnection(){
        if(!this.ws){
            this.connected = false;
            return Promise.resolve(this.connected)
        }
        this._connectionPromise = new Promise((resolve,reject)=>{
            this.ws.send(`ACK`)
        })
        return this._connectionPromise
    }
    _auth(header){
        let hd = header
    }
    _onMessage(rawMessage){
        let ln = rawMessage.split("\r\n")
        this._auth(ln).then((verb)=>{
            switch(verb){
                default:
                this.ws.send("ERR\r\nVERB\r\n")
            }
        }).catch(()=>{
            this.disconect()
        })
    }
}
class Match{
    constructor(code,admin){
        this.code = code
        this.admin = admin 
        this.admin.ws.send(`JOINED ${code} ADMIN`)
    }
}
import { serve } from "https://deno.land/std@0.87.0/http/server.ts";

function serveWebSocket(options){
    const value = serve(options)
    const iterable = {
        next(){
            return {
                done:false,
                value,
            }
        },
        [Symbol.asyncIterator](){
            return this;
        }
    }
    return iterable;
}

async function serveWebSocket(options){
    for await (const request of serve(options)){
        if(request.headers.get("upgrade") != "WebSocket"){
            return new Response(null,{status:501})
        }
    }
    let server = serve((request)=>{
        
        for(key of this._events){
            ws.addEventListener(key,this._events[key].listener,this._events[key].options)
        }
        const {socket:ws, response} = Deno.upgradeWebSocket(request)
        return response
    },options)
}
class WebSocketServer{
    constructor(options){
        this.server = serve(this.handler,options)
        this._events = {}
    }
    handler(request){
    }
    addEventListener(type,listener,options=false){
        this._events[type].listener = listener;
        this._events[type].options = options
    }
}

