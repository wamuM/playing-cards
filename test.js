import pc from "./mod.js"
const {Game} = pc;
const defaultSettings = {
    maxPlayers:undefined,
    minPlayers:2
}
const game = new Game("Black Jack",defaultSettings)

game.addEventListener("join",(player)=>{
    
})
game.addEventListener("start",(game)=>{
    
})
game.listen({port:8080})



