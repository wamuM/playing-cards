import pc from "./mod.js"
const {Game,serveWebSocket} = pc;
const game = new Game("Black Jack")
for await(ws of game.serveWebSocket(false,{port:8080}){
    
}



