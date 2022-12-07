if(confirm("Do you want to reset the token?")){
    localStorage.removeItem("token") 
}

const ws = new WebSocket(`ws://${window.location.host}${window.location.pathname}?ws=true`)
let TOKEN = localStorage.getItem("token");
ws.onopen = ()=>{
    ws.send(`CONNECT ${TOKEN||""}`)
    document.onload = ()=>{
        const btnJoin = document.getElementById("joinGame")
        const btnCreate = document.getElementById("createMatch")
        const inptCode = document.getElementById("matchCode")
        btnJoin.onclick = ()=>{
            let value = inptCode.value
            if(value==""||!value)return alert("You need to write the match code to join it!")
            ws.send(`JOIN ${TOKEN}\r\n${value}`)
        }
        btnCreate.onclick = ()=>{
            
        }
    }
}
ws.onclose = (closeEvent)=>{
    console.error(`${closeEvent.code} ${closeEvent.reason}`)
}
ws.onmessage = (messageEvent)=>{
    const data = messageEvent.data.split("\r\n")
    const [verb,promiseIdentifier] = data[0].split(" ")

    switch(verb){
        case "TOKEN":
            TOKEN = data[1]
            localStorage.setItem("token",TOKEN)
            console.log("token set to "+TOKEN)
        break;
        case "NAME":
            document.title = data[1]
            document.getElementById("lobbyTitle").onload = ()=>{
                document.getElementById("lobbyTitle").innerHTML = data[1] 
            }
        break;
        case "WRONGCODE":
            alert("That match is either full or doesn't exist, please try another code or create your own match")
        break;
        case "JOINED":
            
        break;
        default:
            this.disconnect(4406,"Unknown webSocket verb")
        break;
    }
}


