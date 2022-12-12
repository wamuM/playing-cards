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
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    ctx.closePath()
    ctx.beginPath()
        ctx.strokeStyle = '#b08913';
        ctx.lineWidth = 3.1415926535897932384626
        ctx.strokeRect(30, 30, canvas.width-60, canvas.height-60)
    ctx.closePath()
}




/**
 * draws a Card 
 * @param {Drawable} drawableCard 
 * @param {Number} zoom 
 */
function drawCard(ctx,canvas,drawableCard, zoom) {
    let x = drawableCard.x 
    let y = drawableCard.y
    let display = drawableCard.display
    ctx.beginPath() //draw background
        ctx.fillStyle = display.background.primary
        ctx.fillRect(x, y, 0.618/zoom, 1/zoom) // Golden ratio
    ctx.closePath()
    if(!drawableCard.flipped){
        ctx.beginPath()
            ctx.fillStyle = display.background.accent
            ctx.fillRect(x+0.05/zoom, y+0.05/zoom, (0.618-0.1)/zoom, (1-0.1)/zoom) // Golden ratio
        ctx.closePath()
    }else{
        ctx.beginPath()
            ctx.font ="light "+10/zoom+'px console'
            ctx.fontKerning = 0.01/zoom
            console.log(0.05/zoom)
            ctx.strokeStyle = display.color
            ctx.strokeText(display.value, x+0.1/zoom, y+0.15/zoom)
            ctx.strokeText(display.suit, x+0.3/zoom,y+0.15/zoom)
        ctx.closePath();
    }
    ctx.beginPath()
        ctx.strokeStyle ="black"
        ctx.lineWidth = 0.0125/zoom
        ctx.strokeRect(x,y,0.618/zoom, 1/zoom)
    ctx.closePath()
    /*
    ctx.beginPath() // Draw suit and Value at top left

    ctx.closePath()
    ctx.beginPath() // Draw suit and value at the bottom right
        ctx.save()
        ctx.rotate(Math.PI)
        ctx.strokeText(display.value, (x+1)/zoom, (y+1)/zoom)
        ctx.strokeText(display.suit, (x+2)/zoom + 0.618/zoom, (y+2)/zoom + 1/zoom)
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
    let x = drawableDeck.x
    let y = drawableDeck.y
    let drawableCard = drawableDeck.top
    let color = drawableDeck.top.display.background.primary // doubtful syntax
    let size = drawableDeck.size
    ctx.beginPath()
        ctx.fillStyle = color
        ctx.fillRect(x, y, (0.618+Math.log2(size)*0.02)/zoom, (1)/zoom )
    ctx.closePath()
        drawableCard.x = x;
        drawableCard.y = y;
        drawCard(ctx,canvas,drawableCard,zoom)
}




/**
 * 
 * @param {..Iterable} Iterable The iterable object to draw the game
 */
function drawAll(iter) {

    const canvas = window._canvas
    const ctx = window._ctx
    clear(ctx,canvas);
    drawBackground(ctx,canvas);
    for(const element of iter) {
        if(element.object.top)drawDeck(ctx,canvas,element.object,window.zoom||0.01)
        else drawCard(ctx,canvas,element.object,window.zoom||0.01)
    }
}
export default drawAll;