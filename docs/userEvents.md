# User Events
To add an event listener use the ``gameInstance.addEventListener(name,handler)`` method. 
## Create
Triggered when the match is created, the handler takes the match as arguments:
```js
game.addEventListener("create",(match)=>{
    console.log(`A match with code=${match.code} was created`)
})
```
## Join
Triggered when a player joins a match instance, the handler takes the player as argument.
If the handler returns something, the player's nickname (which must be unique) will be set to it.
```js
game.addEventListener("join",(player)=>{
    console.log(`Player ${player.nicname} joined match with code=${player.match.code}`)
    if(player.nickname == "player69")return "Nice Player"
})

```
## Start
Triggered when an admin starts the match, the handler takes the match as argument
```js
game.addEventListener("start",(match)=>{
    let deck = new plc.defaultDecks.french()
    deck.shuffle()
    let placedDeck = match.place(deck)
    
})

```
## Leave