/**
 * Returns a pseudo-random integer N such as a<= N <= b
 * @param {Number} a The minimal value
 * @param {Number} b The maximal value
 * @returns {number} The pseudo-random integer
 */
function int(a,b){
    return Math.floor(Math.random()*(b-a))+a
}
/**
 * Returns a pseudo-random string from another string
 * @param {String} str The string from which characters are picked
 * @param {Number} length The lenght of the final string
 */
function string(str,length){
    let i = length;
    let s = ""
    while(i>0){
        s += str[int(0,str.length-1)]
        i--;
    }
    return s
}

export default {int,string}