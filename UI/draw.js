//todo code a draw function that draws each card, card slot, shadow

//todo  clear -> background -> Drawable<card> -> Drawable<deck> -> card slot -> shadow (and picked card) --> player hand(toggable) 

//Canvas 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

/**
 * Clears the canvas
 */
function clear() {
    ctx.beginPath()
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight)
    ctx.closePath()
}

/**
 * Draws the game mat 
 */

function background() {
    ctx.beginPath()
        ctx.fillStyle = '#125722';
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    ctx.closePath()
    ctx.beginPath()
        ctx.strokeStyle = '#b08913';
        ctx.lineWidth = 3.1415926535897932384626
        ctx.strokeRect(20, 20, canvas.clientWidth-40, canvas.clientHeight-40)
    ctx.closePath()


}




/**
 * draws a Card 
 * @param {Drawable} drawableCard 
 * @param {Number} zoom 
 */
function drawCard(drawableCard, zoom) {
    let x = drawableCard.x 
    let y = drawableCard.y
    let display = drawableCard.object.display
    ctx.beginPath() //draw background
        ctx.fillStyle = display.background
        ctx.fillRect(x, y, 0.618/zoom, 1/zoom) // Golden ratio
    ctx.closePath()
    ctx.beginPath() // Draw suit and Value at top left
        ctx.font = '48px serif'
        ctx.strokeStyle = display.color
        ctx.strokeText(display.value, (x+1)/zoom, (y+1)/zoom)
        ctx.strokeText(display.suit, (x + 2)/zoom, (y + 2)/zoom)
    ctx.closePath()
    ctx.beginPath() // Draw suit and value at the bottom right
        ctx.save()
        ctx.rotate(Math.PI)
        ctx.strokeText(display.value, (x+1)/zoom, (y+1)/zoom)
        ctx.strokeText(display.suit, (x+2)/zoom + 0.618/zoom, (y+2)/zoom + 1/zoom)
    ctx.closePath()
    ctx.beginPath()
        ctx.restore()
        ctx.fontSize = 20/zoom
        ctx.strokeText(display.figure, (x+4)/zoom, (y+4)/zoom)
    ctx.closePath()
    ctx.beginPath()



}