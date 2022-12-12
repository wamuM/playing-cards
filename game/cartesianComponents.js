/**
 * 
 */
class Board{
    constructor(x1, y1, x2, y2) {
        this.x1 = x1
        this.x2 = x2
        this.y1 = y1
        this.y2 = y2
    }

    on_board(x,y) {
        if(( x <= x2 && x >= x1) && (y <= y2 && y >= y1) ) return true
    }
}
/**
 * 
 */
class  CartesianEncapsulator{

}

export default { CartesianEncapsulator,Board}