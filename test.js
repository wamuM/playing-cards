//? A Game of Black Jack

import plc from "./main.js"
const deck = new plc.defaults.decks.french();

const GAME = new plc.Game()


GAME.onEvent("playerJoin",plr=>{
    if(GAME.players.length == 1){
        plr.isDealer = true
        plr.option("Boolean","Start the game?").then(()=>GAME.start(plr))
    }
})

GAME.onEvent("start",(id)=>{
    GAME.players.forEach(plr=>{
        const hand = GAME.hands.create()
        hand.add(deck.grab(),plr.isDealer?false:GAME.players,false)
        hand.add(deck.grab(),GAME.players,false)
    })
})
GAME.onEvent("turn",(id)=>{
})