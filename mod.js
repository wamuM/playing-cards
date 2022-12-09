import server from "./server/server.js"
import gameObjects from "./game/gameObjects.js"
import defaultDecks from "./game/defaultDecks.js"
export default {
    Game:server.Game,
    defaultDecks,
    server:{
        Player:server.ServerSidePlayer,
    },
    Match:server.Match,
    EmptyDeck:gameObjects.Deck,
    Card:gameObjects.Card
};