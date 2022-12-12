import pc from "./mod.js"
const {Game} = pc;
const defaultSettings = {
    maxPlayers:undefined,
    minPlayers:2
}
const game = new Game("Black Jack",defaultSettings)

game.addEventListener("create",(match)=>{

})
game.addEventListener("join",(player)=>{
    
})
game.addEventListener("start",(match)=>{
    console.log("Game Started :O")
    const deck = pc.defaultDecks.french().shuffle()
    let placedDeck = match.place(deck,100,100)
   // let card = deck.pick(0)
    // match.replace(deck)
    // let placedCard = match.place(card,200,200)

})
game.listen({port:8080})



