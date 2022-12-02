# Playing Cards
Playing Cards (plc) is a [Deno](https://test) (ECMASCRIPT 6.0 - a.k.a JavaScript), OOP library that helps people create and play online card games. 

*Note: Although it is possible to use playing cards to make real time card games it is discouraged*

## Module Structure
The plc module is maded of three parts or submodules:
- the [``game``](./game/): All of the cards abstraction
- the [``server``](./server/): The webSocket and http server and the main constructor
- the [``UI``](./UI/): All the client sided files

And it also uses ``tools``, generic functions (specially random related ones) that are used by different parts of the code. 
Everything is wrapped at [mod.js](./mod.js) for easy importantion but it is possible to import invidivual parts of the code. 

## Terminology
Although we have tried to use the most intuitive names to avoid confucion this list explains the main terms. 
- ``user``: Whoever is using this library to create a game, host a server, etc.
- ``game``: An instance of the ``Game`` class that contains event listeners to endorce the rules of a card game and that listens and answers the player requests
- ``match``: A room of players playing the game that has an admin and an entry code
- ``server``: A computer that is running the library, listening to a port and that will allow clients to play the game
- ``client``: The computer/browser that a player is using, by connecting to the server, to play the game 
- ``player``: A client that has an auth token and that comunicates with the server to play the game in a match
- ``admin``: The player that has created the match and that is in charge of moderating the match (kicking bad players, inviting new players, etc)
