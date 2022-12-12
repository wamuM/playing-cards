import startMatch from "./game.js"

//testing
if(confirm("Do you want to reset the token?")){
    localStorage.removeItem("token") 
}
window.logAll = true;
window.board = [];
window.players = [];
window.zoomSpeed = 0.0075
window.zoom = 1
window.cameraX = 0
window.cameraY = 0

const ws = new WebSocket(`ws://${window.location.host}${window.location.pathname}?ws=true`)
let TOKEN = localStorage.getItem("token");
let imAdmin = null;
let code = null;

function send(str){
    if(window.logAll)console.log(str)
    ws.send(str)
}


ws.onopen = ()=>{
    console.log("[WebSocket connection started]")
    send(`CONNECT ${TOKEN||""}`)
    const __addEvents = ()=>{
        console.log("[Document Loaded]")
        const btnJoin = document.getElementById("joinGame")
        const btnCreate = document.getElementById("createMatch")
        const inptCode = document.getElementById("matchCode")
        const btnGame = document.getElementById("startGame")
        btnJoin.onclick = ()=>{
            const value = inptCode.value
            if(value==""||!value)return alert("You need to write the match code to join it!")
            send(`JOIN ${TOKEN}\r\n${value}`)
        }
        btnCreate.onclick = ()=>{
            send(`CREATE ${TOKEN}`)
        }
        btnGame.onclick = ()=>{
            send(`START ${TOKEN}`)
        }
        const lobby = document.getElementById("lobby")
        const gameBoard = document.getElementById("gameBoard")
        const adminBoard = document.getElementById("adminBoard")
        function joinMatch(_code,_imAdmin){
            lobby.style.display = "none"
            gameBoard.style.display = "block"
            imAdmin = _imAdmin
            code = _code
            if(imAdmin)adminBoard.style.display = "block";
            document.getElementById("codeDisplay").innerHTML = "Code: "+code;
            document.getElementById("codeDisplay").onclick = ()=>{
                navigator.clipboard.writeText(code)
                alert("Match Code copied to your clipboard!")
            }
        }
        window.joinMatch = joinMatch;
    }
    window.onload = __addEvents;
    if(window.loaded)__addEvents();
}
ws.onclose = (closeEvent)=>{
    console.error(`${closeEvent.code} ${closeEvent.reason}`)
}
ws.onmessage = (messageEvent)=>{
    if(window.logAll)console.log(messageEvent.data);
    const data = messageEvent.data.split("\r\n")
    const [verb,promiseIdentifier] = data[0].split(" ")

    switch(verb){
        case "TOKEN":
            TOKEN = data[1]
            localStorage.setItem("token",TOKEN)
            console.log("token set to "+TOKEN)
        break;
        case "NAME":{
            document.title = data[1]
            const h1 = document.getElementById("lobbyTitle")
            h1.innerHTML = data[1]
            h1.onload = ()=>{h1.innerHTML = data[1]}
        break;
        }
        case "WRONGCODE":
            alert("That match is either full or doesn't exist, please try another code or create your own match")
        break;
        case "JOINED":
            window.joinMatch(data[1],!!data[3])
            window.nickname = data[2]
        break;
        case "NEWPLAYER":
            window.players.push([data[1],data[2]])
        break;
        case "UPDATE":{
            switch(data[1]){
                case "Modify":
                    window.board[Number.parseInt(data[3])] = JSON.parse(data[2])
                break;
                case "Delete":
                    window.board.splice(0,Number.parseInt(data[3]))
                    window.board.forEach((_element,i)=>{
                        if(i>=index)this.board[index].id = index-1
                    })
                break;
                case "Add":
                    window.board.push(JSON.parse(data[2]))
                break;
                default:
                    send("UPDATEME "+TOKEN)
                break;
            }
            break;
        }
        case "BOARD":{
            data.shift()
            window.board = JSON.parse(data.join("\r\n"))
        break;
        }
        case "START":
            startMatch()
            alert("The Game Has Started")
        break;
        default:
            console.error("Fatal Server Error\n"+data.join("\r\n"))
        break;
    }
}


