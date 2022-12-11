import Card  from './gameObjects.js'
import Deck from './gameObjects.js'

const suits = ['❤', '♦', '♣', '♠']

let cards = []
for (let i = 0; i < 4; i++) {
    family = suits[i]
    for (let j = 1; j < 14; j++) {
        if (j == 11) { // J
            cards.append(new Card(j, i, display = {j,i,color:"black",background:"white",figure: j}, True))
        }
        else if ( j == 12) { // Q
            cards.append(new Card(j, i, display = {j,i,color:"black",background:"white",figure: j}, True))
        }
        else if ( j == 13) { // K
            cards.append(new Card(j, i, display = {j,i,color:"black",background:"white",figure: j}, True))
        }
        else { // all others
            cards.append(new Card(j, i, display = {j,i,color:"black",background:"white",figure: j}, True))
        }
    }
    
}

let french  = new Deck(cards)




export default {french};

