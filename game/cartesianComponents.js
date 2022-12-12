/**
 * 
 */
class Board extends Array{
    constructor(send,...args){
        super(...args)
        this.send = send;
    }
    place(element,x,y){
        let car = new CartesianEncapsulator(element)
        car.id = this.length
        car.x = x;
        car.y = y;
        this.push(car)
    }
    modify(index,element){
        this[index].modify(...args)
        this.send("UPDATE",["Modify",element,index])
    }
}
/**
 * 
 */
class CartesianEncapsulator{
    constructor(element){
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