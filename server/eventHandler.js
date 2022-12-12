/**
 * Handles client-to-server messages
 * @param {module:server.ServerSidePlayer} player The player that received the messageEvent
 * @param {WebSocket.messageEvent} messageEvent The websocket message event
 */
function eventHandler(player,messageEvent){
    console.log(messageEvent.data)
    const data = messageEvent.data.split("\r\n")
    const [verb,token,_promiseIdentifier] = data[0].split(" ")
    if(!token)player.disconnect(4401,"Unauthorized: No token was provided ")
    if(!player.auth(token))return player.disconnect("4403","Forbidden: Wrong token")
    if(player.promises.get(_promiseIdentifier))player.promises.get(_promiseIdentifier).resolve(data)
    switch(verb){
        case "UPDATEME":{
            player.send("BOARD",JSON.stringify(player.match.board))
            break;
        }
        case "CREATE":{
            const match = player.game.spawnMatch(player);
            player.game.oncreate(match)
            const nick = player.game?.onjoin(player)||"admin"//Event: Join
            if(nick)player.nickname = nick;
            player.send("JOINED",[player.match.code,player.nickname,"isAdmin=true"])
            player.match.sendAll("NEWPLAYER",player.nickname)
            break;
        }
        case "JOIN":{
            const match = player.game.matches.get(data[1])
            if(!match)return player.send("WRONGCODE")
            if(player.game.settings?.maxPlayers>=match.players.size)return player.send("WRONGCODE")
            if(!player.game.settings.allowMidgameJoins && match.hasStarted)return player.send("WRONGCODE")
            if(match.bannedTokens.has(player.token))return player.disconnect(4401,"Unauthorized: This client was banned")
            match.join(player)
            const nick = player.game?.onjoin(player)//Event: Join
            if(nick)player.nickname = nick;
            player.send("JOINED",[match.code,player.nickname])
            player.match.sendAll("NEWPLAYER",player.nickname)
            break;
        }
        case "START":
            if(player.match.admin != player)return player.disconnect(4401,"Unauthorized: Only admin player can start game");
            player.match.hasStarted = true;
            player.match.sendAll("START")
            player.match.sendAll("BOARD",JSON.stringify(player.match.board))
            player.game.onstart(player.match)//Event: Start
        break;
        default:
            player.disconnect(4406,"Wrong Method: Unknown WebSocket Verb")
        break;
    }

}

export default eventHandler;