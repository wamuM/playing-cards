import random from "../tools/random.js"

/**
 * Class representing a Card
 */
class Card{
    /**
     * Creates a card instance
     * @param {Number} value The game value of the card (i.e 13 for King)
     * @param {String|Number} suit The suit of the card (i.e Diamonds)
     * @param {CardDisplayObject} [display] The card display defaults to white background with black color
     * @param {Boolean} flipped Whether the card information is face up
     */
    constructor(value, suit, display,flipped) {
        this.value = value;
        this.suit = suit;
        if(!display.value)display.value = value
        if(!display.suit)display.suit = suit;
        if(!display.figure)display.figure = suit;
        if(!display.color)display.color = "black";
        if(!display.background)display.background = {}
        if(!display.background.primary)display.background.primary = "white";
        if(!display.background.accent)display.background.accent = "blue";
        this.display = display;
        this.flipped = flipped;
    }
    /**
     * Flips the card
     */
    flip () {
        this.flipped = !this.flipped
    }


}
/**
 * Class representing a Deck
 */
class Deck {
    /**
     * 
     * @param {Iterable<Card>} cards The iterable of cards that makes up the deck
     */
    constructor(cards){
        this.cards = []
        for(const e of cards){
            this.cards.push(e)
        } 
    }
    /*#not actually jsdoc
    * @returns {Number} size of Deck (may be irrational i.e a Deck of pi cards)
    */
    get size() {
        return this.cards.length

    }
    /**
    * Shuffles the Deck of cards using the Fischer-Yates algorithm and the pseudo-random Math.random() method
    */
    shuffle() {

        let ind = this.cards.length -1;
        let temp, j;
        while (ind > 0) {
            j = random.int(0, ind+1)
            temp = this.cards[j]
            this.cards[j] = this.cards[ind]
            this.cards[ind] = temp
            ind-- 
        }
    }
    /**
     * Picks a card
    * @param {Number} [index] The index at which the card is picked, defaults to a pseudo-random one
    * @param {Boolean} [keepIn] If set to true, will keep the card in; defaults to false
    * @returns {Card} The picked card
    */
    pick(index=false,keepIn=false) {
        if(!index)index = random.int(0, this.size-1)
        if(!keepIn)this.cards.splice(index, 1)
        if(index<0)index = this.size+index;
        return this.cards[index]
    }
    /**
     * Adds a given number of cards to the Deck
     * @param {Iterabe<Card>|Card} cards 
     */
    add(cards) {
        if(card instanceof Card)card = [card];
        cards.forEach(card => {
            this.cards.push(card)
        });

    }
/**
 * Flips the deck
 */
    flip() {
        this.cards.forEach( card => {
            card.flip
        })
        this.cards.reverse()
    }
}




export {Deck,Card};


/**
 * @typedef CardDisplayObject
 * @property {Number|String} value The displayed value of the card
 * @property {CSSColor} color The displayed color of the card
 * @property {CSSColor} background The displayed background color of the card
 * @property {String|Number} suit The text corresponding to the suit, displayed next to value
 * @property {String|Image} figure The displayed figure on the center of the card
 */

 /**
  * @typedef {String} CSSColor  A valid CSS string
  */