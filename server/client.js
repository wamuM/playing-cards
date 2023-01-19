/**
 * Creates a client
 * @class
 */
function Client(token){
    this.token 
}

async function connection(socket,authToken){
    return new Promise((resolve,reject)=>{
        socket.onmessage = (messageEvent)=>{
            const data = messageEvent.data.split("\r\n")
            const [verb,token] = data[0].split(" ")
            if(authToken != token){
                ws.close(4403,"Forbidden: Wrong token")
                reject(new Error("Forbidden: Wrong token"));
                return;
            }
            if(verb != "CONNECT"){
                ws.close(4405,"The first request should always be CONNECT")
                reject(new Error("The first request should always be CONNECT"))
                return;
            }
            resolve(token)
        }
    })
}
Client.prototype.connection = connection;

async 

export default Client;