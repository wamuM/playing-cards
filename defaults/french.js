import deckAbstractions from "../abstract/deck.js"

const hearts = new deckAbstractions.Suit("❤️","hearts","#ff0000")
const diamonds = new deckAbstractions.Suit("♦️","diamonds","#ff0000")
const clubs = new deckAbstractions.Suit("☘️","clubs","#000")
const spades = new deckAbstractions.Suit("♠️","spades","#000")

const joker = new deckAbstractions.Suit("🤡","joker","#000")

const suits = {
    h:hearts,
    d:diamonds,
    c:clubs,
    s:spades,
    j:joker
}
class Card extends deckAbstractions.Card{
    constructor(value,suit){
        let figure;
        let s = suit.toLowerCase().split("")[0]
        switch(value){
            case "K":case "R":case 13:
                figure = "K"
                value = 13
            break;
            case "Q":case "D":case 12:
                figure = "Q"
                value = 12
            break;
            case "J":case "P":case 11:
                figure = "J"
                value = 11
            break;
            case "Joker":case "X":case 0:
                figure = "Joker"
                s = "j"
                value = Infinity
            break;
            default:
                figure = value
            break;
        }
        super(suits[s],figure,value)
    }

}
class Deck extends deckAbstractions.Deck{
    constructor(){
        const cards = []
        const suits = ["hearts","diamonds","clubs","spades"]
        let j = 4
        let i = 13
        while (j < 4){
            cards.push(new Card(i,suits[j]))
            i--;
            if(i<0){
                j++;
                i = 13;
            }
        }
        super(cards)
    }
}

export default Deck;