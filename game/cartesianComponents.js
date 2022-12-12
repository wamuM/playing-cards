/**
 * 
 */
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