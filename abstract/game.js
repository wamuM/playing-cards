import Collection from "./collection.js"
import deckAbstractions from "./deck.js"
import Player from "./player.js"
class Game {
    constructor(){
        this.hands = new Collection(deckAbstractions.Hand)
        this.players = new Collection(Player)
        this.triggerEvent= {}
    }
    onEvent(event,fn){
        this.triggerEvent[event] = fn;
    }
    triggerEvent(event,...args){
        this.triggerEvent[event](...args)
    }
    start(...args){
        this.triggerEvent("start",...args)
    }
}

export default Games