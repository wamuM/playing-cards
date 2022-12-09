//testing
if(confirm("Do you want to reset the token?")){
    localStorage.removeItem("token") 
}
window.logAll = true;

const ws = new WebSocket(`ws://${window.location.host}${window.location.pathname}?ws=true`)
let TOKEN = localStorage.getItem("token");

function send(str){
    if(window.logAll)console.log(str)
    ws.send(str)
}
ws.onopen = ()=>{
    console.log("WebSocket connection started...")
    send(`CONNECT ${TOKEN||""}`)
    const __addEvents = ()=>{
        const btnJoin = document.getElementById("joinGame")
        const btnCreate = document.getElementById("createMatch")
        const inptCode = document.getElementById("matchCode")
        btnJoin.onclick = ()=>{
            const value = inptCode.value
            if(value==""||!value)return alert("You need to write the match code to join it!")
            send(`JOIN ${TOKEN}\r\n${value}`)
        }
        btnCreate.onclick = ()=>{
            
        }
    }
    window.onload = __addEvents;
    __addEvents();
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
            if
        break;
        default:
            this.disconnect(4406,"Unknown webSocket verb")
        break;
    }
}


