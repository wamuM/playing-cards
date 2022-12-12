import drawAll from "./draw.js"

function send(verb,str=""){
    if(window.logAll)console.log(str)
    ws.send(verb+" "+localStorage.getItem("token")+" "+str)
}
let dx = 0
let dy = 0
function frame(timestampt){
    let dt = Math.abs(window._lastTimeStampt-timestampt)/(1000/45)

    if(window.pressedKeys.has("left_click") &&window.bool){//onclick
        dx = window.mouseX
        dy = window.mouseY
        window.bool = false
    }else if(!window.bool){//on release
        dx = window.mouseX-dx
        dy = window.mouseY-dy
        window.cameraX += dx||0
        window.cameraY += dy||0
        window.bool = true
    }
    console.log(window.cameraX,window.cameraY)
    drawAll(window.board)
    requestAnimationFrame(frame);
    if(Math.floor(Math.random*100)==0)send("UPDATEME")
}
function checkControls(key){
    switch(key){
        case "o":
            window.zoom += window.zoomSpeed
        break;
        case "p":
            window.zoom -= window.zoom*window.zoomSpeed
        break;
        case "d":
            window.debug = !window.debug
        break;
    }
    if(window.zoom<=0)window.zoom = 1;

}
function pointInRectCollider(point,rect){

}
import setUpKeyEvents from "./keys.js"
function startMatch(){
    setUpKeyEvents(checkControls,document.getElementById("canvas"))
    document.onnwheel = (event)=>{
        console.log(window.zoom)
        if(event.deltaY > 0){    
            window.zoom -= window.zoomSpeed
        }else{    
            window.zoom += window.zoomSpeed
        }
    event.preventDefault()
    }

    window._canvas = document.getElementById("canvas")
    window.onresize = ()=>{
        window._canvas.height= window.innerHeight; 
        window._canvas.width = window.innerWidth;
    }
    window._canvas.height= window.innerHeight; 
    window._canvas.width = window.innerWidth;
    window._ctx = window._canvas.getContext("2d")
    window._ctx.imageSmoothingEnabled = false;
    window._lastTimeStampt = Date.now()
    requestAnimationFrame(frame)
}
export default startMatch;