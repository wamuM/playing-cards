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

const defaultDeck = {};
defaultDeck.french =()=> new Deck(cards);




export default defaultDeck;

