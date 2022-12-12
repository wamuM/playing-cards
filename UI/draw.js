//todo code a draw function that draws each card, card slot, shadow

//todo  clear -> background -> Drawable<card> -> Drawable<deck> -> card slot -> shadow (and picked card) --> player hand(toggable) 

/**
 * Clears the canvas
 */
function clear(ctx,canvas) {
    ctx.beginPath()
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)
    ctx.closePath()
}

/**
 * Draws the game mat 
 */

function drawBackground(ctx,canvas) {
    ctx.beginPath()
        ctx.fillStyle = '#125722';
        ctx.fillRect(scaleWidth(window.cameraX), scaleHeight(window.cameraY), scaleWidth(canvas.width), scaleHeight(canvas.height))
    ctx.closePath()
    ctx.beginPath()
        ctx.strokeStyle = '#b08913';
        ctx.lineWidth = 3.1415926535897932384626
        ctx.strokeRect(scaleWidth(window.cameraX+30), scaleHeight(window.cameraY+30), scaleWidth(canvas.width-60), scaleHeight(canvas.height-60))
    ctx.closePath()
}




/**
 * draws a Card 
 * @param {Drawable} drawableCard 
 * @param {Number} zoom 
 */
function drawCard(ctx,canvas,drawableCard, zoom) {
    let x = drawableCard.x+window.cameraX
    let y = drawableCard.y+window.cameraY
    let display = drawableCard.display
    ctx.beginPath() //draw background
        let w = 61.8
        let h = 100
        let offset = 5
        ctx.fillStyle = display.background.primary
        ctx.fillRect(scaleWidth(x),scaleHeight(y),scaleWidth(w),scaleHeight(h)) // Golden ratio
    ctx.closePath()
    if(drawableCard.flipped){
        ctx.beginPath()
            ctx.fillStyle = display.background.accent
            ctx.fillRect(scaleWidth(x+offset),scaleHeight(y+offset),scaleWidth(w-2*offset),scaleHeight(h-2*offset))
        ctx.closePath()
    }else{
        ctx.beginPath()
            ctx.font ="light "+10*zoom+'px console'
            ctx.fontKerning = 0.01*zoom
            ctx.strokeStyle = display.color
            ctx.strokeText(display.value, x+0.1*zoom, y+0.15*zoom)
            ctx.strokeText(display.suit, x+0.3*zoom,y+0.15*zoom)
        ctx.closePath();
    }
    ctx.beginPath()
        ctx.strokeStyle ="black"
        ctx.lineWidth = scaleWidth(1)>1?1:scaleWidth(1)
        w = 61.8
        h = 100
        ctx.strokeRect(scaleWidth(x),scaleHeight(y),scaleWidth(w),scaleHeight(h))
    ctx.closePath()
    /*
    ctx.beginPath() // Draw suit and Value at top left

    ctx.closePath()
    ctx.beginPath() // Draw suit and value at the bottom right
        ctx.save()
        ctx.rotate(Math.PI)
        ctx.strokeText(display.value, (x+1)*zoom, (y+1)*zoom)
        ctx.strokeText(display.suit, (x+2)*zoom + 0.618*zoom, (y+2)*zoom + 1*zoom)
    ctx.closePath()
    */

    ctx.closePath()
    ctx.beginPath()



}

/**
 * 
 * @param {Drawable} drawableDeck The object encapsulating the Deck
 * @param {Drawable} drawableCard The card to be drawn on top of the deck
 * @param {Number} zoom The zoom factor to adjust proportions
 */
function drawDeck(ctx,canvas,drawableDeck, zoom) {
    let x = drawableDeck.x+window.cameraX
    let y = drawableDeck.y+window.cameraY
    let drawableCard = drawableDeck.top
    let color = drawableCard.display.background.primary 
    let size = drawableDeck.size
    ctx.beginPath()
        let w = 61.8
        let h = 100
        let offset = Math.log2(size)
        ctx.fillStyle = color
        ctx.fillRect(scaleWidth(x),scaleHeight(y),scaleWidth(w+offset),scaleHeight(h))
    ctx.closePath()
        drawableCard.x = drawableDeck.x;
        drawableCard.y = drawableDeck.y;
        drawCard(ctx,canvas,drawableCard,zoom)
}

function scaleWidth(w){
    return w/1920*window.zoom*window._canvas.width
}
function scaleHeight(h){
    return h/920*window.zoom*window._canvas.height
}

/**
 * 
 * @param {..Iterable} Iterable The iterable object to draw the game
 */
function drawAll(iter) {
    const canvas = window._canvas
    const ctx = window._ctx
    clear(ctx,canvas);
    drawBackground(ctx,canvas)
    if(window.debug){
        console.log(window.mouseX,window.mouseY)
        ctx.beginPath()
            ctx.strokeStyle = "black"
            ctx.font = "18px Arial"
            ctx.strokeText(`mouse(x,y): ${window.mouseX} ${window.mouseY}`,20,20)
        ctx.closePath()
    }
    for(const element of iter) {
        if(element.object.top)drawDeck(ctx,canvas,element.object,window.zoom||0.01)
        else drawCard(ctx,canvas,element.object,window.zoom||0.01)
    }
}
export default drawAll;