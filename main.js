//? This file encapsulates all of the library
/**
 * An ecapsulation of the playingCards library
 * @module playingCards
 */
import random from "./tools/random";

import defaultDecks from "./defaults/french.js"
import deckAbstractions from "./abstract/deck";


const playingCards = {
    tools:{
        random
    },
    defaults:{
        decks:{
            french:defaultDecks.french
        }
    },

}
export default playingCards;