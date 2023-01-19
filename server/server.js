import random from "../tools/random";
import Client from "./client.js"
import serveFileServer from "./fileserver";
/**
 * Filters URLs
 * @param {URL} requestUrl The URL of the request to be filtered.
 * @param {URLPattern} urlPattern The pattern to match against the requestUrl
 * @returns {URL} The filtered URL
 */
function filterURL(requestUrl, urlPattern){
    if(!urlPattern) return requestUrl;
    if(!urlPattern.test(requestUrl))throw new Error("Request sent at wrong location")
    return urlPattern.exec(requestUrl)

}

/**
 * 
 * @param {Deno.RequestEvent} requestEvent 
 * @param {PlayingCards.serverOptions} options
 * @returns {WebSocket} Returns a socket if the request resolved into a client connecting
 */
async function handleHttpRequest(requestEvent,options){
    const REQUEST_URL = filterURL(new URL(requestEvent.request.url),options.url);
    const PATH = REQUEST_URL.pathname;

    if(!(requestEvent.request.headers.get("upgrade") == "websocket")){
        await serveFileServer(PATH,requestEvent)
        return;
    }
          
    try{
        const {socket,response} = Deno.upgradeWebSocket(requestEvent.request)
        await requestEvent.respondWith(response)
        resolve(socket)
    }catch(error){
        await requestEvent.respondWith(new Response(error,{status:400}))
    } 
}
/**
 * Serves the game 
 * @param {PlayingCards.serverOptions} options
 */
async function serveGame(options){
    const GAME = new Game();
    (async()=>{

    if(options.pathname)options.url = new URLPattern({pathname:options.pathname});

    if(options.silent)console.log("Serving Playing Cards game")
    for await (const connection of Deno.listen(options)){
        __http: for await(const requestEvent of Deno.serveHttp(connection)){
            try{
                const socket = handleHttpRequest(requestEvent,options)
                if(!socket)continue __http;

                socket.onmessage = socketOnMessage;
                socket.onclose   = socketOnClose;

                let token = await client.connection(socket)
                if(!token) 
                    do{
                        token = tools.random.string("QWERTYUIOPASDFGHJKLZXCVBNM_-1234567890qwertyuiopasdfghjklzxcvbnm+",10)
                    }while(Game.clients.get(token))
                const client = Game.clients.get(token);
                if(!client){
                    client = new Client(token)
                    Game.clients.set(client.token,client)
                }
            }catch(error){
                switch(error.message){
                    case "Request sent at wrong location":
                        if(options.verbose)console.log(error)
                    continue __http;
                    default:{
                        throw new Error("Unexpected Error whilst handling requests",{cause:error})
    }}}}}})();
    return GAME
}

/**
 * @typedef serverOptions
 * @property {boolean} [verbose=false] If set to true the server will log **everything**. 
 * @property {boolean} [silent=false] If set to true the server will only log fatal errors.
 * @property {(URLPatternInput.pathname|string)} [pathname] Checks this path over all incoming request paths (overwrites this.url).
 * @property {URLPattern} [url] Checks this URL agaisnt all incoming requests and allows those that match.
 */

export {filterURL, serveGame, handleHttpRequest};