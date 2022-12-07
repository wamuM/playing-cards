import pc from "./mod.js"
const {Game} = pc;
const game = new Game("Black Jack",defaultSettings)

game.settings = {
    maxPlayers:undefined,
    minPlayers:2
}
game.addEventListener("join",(player)=>{
    
})
game.addEventListener("start",(game)=>{
    
})
game.listen({port:8080})



