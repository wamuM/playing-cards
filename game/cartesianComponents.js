/**
 * 
 */
<<<<<<< HEAD
class Board{
    constructor(x1, y1, x2, y2) {
        this.x1 = x1
        this.x2 = x2
        this.y1 = y1
        this.y2 = y2
    }

    on_board(x,y) {
        if(( x <= x2 && x >= x1) && (y <= y2 && y >= y1) ) return true
=======
class Board extends Array{
    constructor(...args){
        super(...args)
    }
    place(element,x,y){
        let car = new CartesianEncapsulator(element)
        car.id = this.length
        element.id = car.id
        car.object.x = x;
        car.object.y = y;
        this.push(car)
>>>>>>> 46b186e062e2c2c88b8622aed76f8723de5d3482
    }
}
/**
 * 
 */
class CartesianEncapsulator{
    constructor(element){
        if(!element)throw "An element must be provided to the CartesianEncapsulator"
        this.trueObject = element;
        this.object = Object.assign({},element);
        this.trueObject.toJSON=()=>undefined;
        if(this.object.cards){
            delete this.object.cards
            this.object.top = this.trueObject.pick(0,true)
            this.object.bellow = this.trueObject.pick(1,true)
            this.object.bottom = this.trueObject.pick(-1,true)
            this.object.size = this.trueObject.size;
        }

    }

}

export {CartesianEncapsulator,Board};