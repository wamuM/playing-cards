class Collection{
    constructor(type){
        this.collector
        this.type = type
    }
    create(...args){
        this.collector.push(new this.type(...args))
    }
}
export default Collection