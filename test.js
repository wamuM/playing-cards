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
    const deck = new pc.defaultDecks.french();
    deck.shuffle();
    match.place(deck)
})
game.listen({port:8080})



