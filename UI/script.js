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
            
        }
        btnCreate.onclick = ()=>{
            
        }
    }
}
ws.onclose = console.error;
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
        default:
            this.disconnect(4406,"Unknown webSocket verb")
        break;
    }
}


