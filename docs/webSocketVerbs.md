## Server to Client(Player)
### NAME
Sent as a reply to [`CONNECT`](#connect)
```
NAME
${gameName}
```
- `gameName`: The name of the game
### <a name="token"></a>TOKEN
Sent when a player connects withouth specifiying a token
```
TOKEN
${token}
``` 
- `token`: The new auth token 
### JOINED
Sent when a player joins a match
```
JOINED
${code}
${[isAdmin]}
``` 
- `code`: The match code
- `isAdmin`: If the player is the match admin (left blank if not)
## Client(Player) to Server
### <a name="connect"></a>CONNECT
Sent to connect a websocket to a player
```
CONNECT ${[token]}
```
- `token` The auth token (if left blank, the server will provide one with [`TOKEN`](#token))
### CREATE
Sent to create a match with the player as an admin, is answered by ([`JOINED`](#joined))
```
CREATE
```