
/**
 * A collection of tools to use Math.random() more easily
 * @module random
 */

/**
 * Returns a pseudo-random (Math.random()) integer N such as A <= N >= B
 * @param {Number} min The minimal value (included)
 * @param {Number} max The maximal value (included)
 * @returns 
 */
function int(min,max){
    return Math.floor(Math.random()*(max-min))+min
}


export default {int}