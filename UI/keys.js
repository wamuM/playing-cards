/**
 * It sets up event listeners to keep track of pressed keys and mouse cords
 * @param {DOMElement} clickContext The HTML element that works as the "context" for the events
 */
function setUpKeyEvents(checkControls,clickContext){
    clickContext.addEventListener("mousemove",(e)=>{
        window.mouseX = e.offsetX||e.clientX
        window.mouseY = e.offsetY||e.clientY
    })
    window.pressedKeys = new Set();
    //get mouse buttons
    clickContext.addEventListener("mousedown",(e)=>{
        switch(e.button){
            case 0:if(e.buttons===0)break;//this is because people can't follow the standarts for some reason
            case 1:window.pressedKeys.add("left_click");      break;
            case 2:window.pressedKeys.add("right_click");     break;
            case 3:window.pressedKeys.add("browser_back");    break;
            case 4:window.pressedKeys.add("browser_forward"); break;
        }
       if(e.button == 2)e.preventDefault();//this prevents the context menu
    })
    clickContext.addEventListener("contextmenu",(e)=>{e.preventDefault();return false;})//same here, better be safe
    clickContext.addEventListener("mouseup",(e)=>{
        switch(e.button){
            case 0://same problem with standarts
            case 1:window.pressedKeys.delete("left_click");      break;
            case 2:window.pressedKeys.delete("right_click");     break;
            case 3:window.pressedKeys.delete("browser_back");    break;
            case 4:window.pressedKeys.delete("browser_forward"); break;
        }
    })
    document.addEventListener("keydown",(e)=>{
        window.pressedKeys.add(e.key)
        checkControls(e.key)
    })
    document.addEventListener("keyup",(e)=>{
        window.pressedKeys.delete(e.key)
    })
}
export default setUpKeyEvents;