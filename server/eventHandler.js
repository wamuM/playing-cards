/**
 * Handles client-to-server messages
 * @param {module:server.ServerSidePlayer} player The player that received the messageEvent
 * @param {WebSocket.messageEvent} messageEvent The websocket message event
 */
function eventHandler(player,messageEvent){
    const data = messageEvent.data.split("\r\n")
    const [verb,token,_promiseIdentifier] = data[0].split(" ")
    if(!token)player.disconnect(4401,"Unauthorized")
    if(!player.auth(token))player.disconnect("4403","Forbidden")
    if(player.promises.get(_promiseIdentifier))player.promises.get(_promiseIdentifier).resolve(data)
    switch(verb){
        case "CREATE":
            player.game.spawnMatch(player);
            //spawnMatch also sends JOINED to the client
        break;
        case "JOIN":{
            const match = player.game.matches.get(data[1])
            if(!match)return player.send("WRONGCODE")
            if(player.game.settings?.maxPlayers>=match.players.size)return player.send("WRONGCODE")
            if(!player.game.settings.allowMidgameJoins && match.hasStarted)return player.send("WRONGCODE")
            if(match.bannedTokens.has(player.token))return player.disconnect(4401,"Unauthorized")
        }
        break;
        case "START":
            if(player.match.admin != player)return player.disconnect(4401,"Unauthorized");
            player.match.hasStarted = true;
            player.match.sendAll("START")
            player.match.sendAll("BOARD",JSON.stringify(player.match.board))
        break;
        default:
            player.disconnect(4406,"Unknown WebSocket Verb")
        break;
    }

}

export default eventHandler;