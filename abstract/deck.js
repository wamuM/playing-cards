/**
 * The collection of abstractions of all elements of a deck
 * @module deckAbstractions
 */

import random from "../tools/random.js"
class Suit{
    /**
     * Describes a suit of cards
     * @param {String} symbol The symbol of the suit (i.e ♠️ for spades, etc)
     * @param {String} name The name of the suit (i.e spades for ♠️ )
     * @param {ColorString} color the color the suit
     */
    constructor(symbol,name, color){
        this.symbol = symbol;
        this.name = name;
        this.color = color;
    }
}
class Card{
    /**
     * A card
     * @param {Suit} suit The suit of the card
     * @param {String|Number} figure The figure (number or letter)
     * @param {Number} value The value (i.e 13 for King, etc)
     */
    constructor(suit,figure,value){
        this.value = value;
        this.suit = suit;
        this.figure = figure;
    }
}
class Deck {
    //? A deck is a group of cards that no one can access, which differenciates it from a Hand, which are shown to the specified persons
    /**
     * A deck of cards
     * @param {Iterable<Card>} cardsIterable An iterable of cards
     */
    constructor(cardsIterable){
        this.cards = cardsIterable;
    }
    get length(){
        return this.cards.length
    }
    /**
     * Adds a card to thec deck
     * @param {Card} card The card that will be added
     * @param {Number} [index] The index in which the card will be added, if not specified it will add it to a random index
     */
    add(card,index=undefined){
        this._add(card,index)
    }
    _add(card,index){//? to protect from inheritance
        if(!index)index = random.int(0,this.cards.length-1)
        //todo Finish this
    }
    /**
     * grabs a cart from the deck
     * @param {Number} [index] Index of the card you want to grab (use negative numbers to start from the end)
     * @param {Boolean} [keepIn] If you don't want the card to be removed from the deck 
     * @returns {Card} The grabed card
     */
    grab(index=0,keepIn=false){
        if(index < 0 ) index = this.cards.length + index;
        if(keepIn)return this.cards[index];
        return this.cards.splice(index,1);
    }
    /**
     * Shuffles the deck using the Fischer-Yates algorithm and the pseudo-random Math.random() method
     */
    shuffle(){
        let ind = this.cards.length-1 
        while(ind>0){
            let c = this.cards[ind]
            let rand = random.int(0,ind)
            this.cards[ind] = this.cards[rand]
            this.cards[rand] = c
            ind--; 
        }
    }
    /**
     * Splits the deck
     * @param {Number} groups the number of groups of cards you want to split to
     * @param {Boolean} [remainder] If set to false, the code will splits uneavenly to avoid having a remainder
     * @param {Number} [groupsize] the size of the group of cards, defaults to Math.floor(cards.lenght)
     * @returns {Array<Deck>} The decks with the remainder at the first index (if there is no remainder it will be an empty list)
     */
    static split(deck,groups,remainder,groupSize=undefined){//todo this
        let decks = new Array(groups+1)
        if(!groupSize)groupSize = Math.floor(this.cards.length)
        let currentGroupSize = 0
        for (let i=0;i<this.cards.length;i++){
            if(currentGroupSize == groupSize)currentGroupSize = 0;
            if(currentGroupSize == 0)decks.push(new Deck())
            decks[0].push()
            currentGroupSize++;
        }
    }
}
class Hand extends Deck{
    constructor(cardsIterable){
        super(cardsIterable)
    }
    add(card,whoCanSee,whoCanMove){
        card.whoCanMove = whoCanMove;
        card.whoCanSee = whoCanSee;
        this._add(card,0)
    }
}

export default {Deck,Suit,Card,Hand}
/**
 * A CSS Legal Color Value
 * @typedef {String} StringColor
 */