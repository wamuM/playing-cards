import {Deck,Card}  from './gameObjects.js'


const suits = ['❤','♣','♦', '♠']

const cards = []
for (let i = 0; i < 4; i++) {
    const family = suits[i]
    for (let j = 1; j < 14; j++) {
        if (j == 11) { // J
            cards.push(new Card(j, family,{j,i,color:i%2==0?"red":"black",figure: j}, true))
        }
        else if ( j == 12) { // Q
            cards.push(new Card(j, family,{j,i,color:i%2==0?"red":"black",figure: j}, true))
        }
        else if ( j == 13) { // K
            cards.push(new Card(j, family,{j,i,color:i%2==0?"red":"black",figure: j}, true))
        }
        else { // all others
            cards.push(new Card(j, family,{j,i,color:i%2==0?"red":"black",figure: j}, true))
        }
    }
    
}

<<<<<<< HEAD
let french  = new Deck(cards)
=======
const defaultDeck = {};
defaultDeck.french =()=> new Deck(cards);
>>>>>>> 46b186e062e2c2c88b8622aed76f8723de5d3482




<<<<<<< HEAD
export default {french};
=======
export default defaultDeck;
>>>>>>> 46b186e062e2c2c88b8622aed76f8723de5d3482

