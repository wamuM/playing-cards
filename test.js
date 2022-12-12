import pc from "./mod.js"
const {Game} = pc;
const defaultSettings = {
    maxPlayers:undefined,
    minPlayers:2
}
const game = new Game("Black Jack",defaultSettings)

game.addEventListener("join",(player)=>{
    
})
game.addEventListener("start",(match)=>{
    console.log("Game Started :O")
    const deck = pc.defaultDecks.french();
    deck.shuffle();
    match.place(deck,100,100)
    //console.log(match.board)
    //console.log(JSON.stringify(match.board))
})
game.listen({port:8080})



