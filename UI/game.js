import drawAll from "./draw.js"

function send(verb,str=""){
    if(window.logAll)console.log(str)
    ws.send(verb+" "+localStorage.getItem("token")+" "+str)
}

function frame(timestampt){
    let dt = Math.abs(window._lastTimeStampt-timestampt)/(1000/45)
    drawAll(window.board)
    requestAnimationFrame(frame);
    if(Math.floor(Math.random*100)==0)send("UPDATEME")
}
function startMatch(){
    window._canvas = document.getElementById("canvas")
    window._canvas.height= window.innerHeight; 
    window._canvas.width = window.innerWidth;
    window._ctx = window._canvas.getContext("2d")
    window._ctx.imageSmoothingEnabled = false;
    window._lastTimeStampt = Date.now()
    requestAnimationFrame(frame)
}
export default startMatch;