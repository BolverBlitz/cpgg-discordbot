/**
 * Returns based on the probability and factor, uses a log graph to calculate the probability
 * @param {Number} probability 
 * @param {Number} factor 
 * @param {Number} jumpAt 
 * @param {Number} creditsper100msg 
 * @returns 
 */
const variable_probability = (probability, factor, jumpAt, creditsper100msg = 100) => {
    if (typeof probability !== "number" || typeof factor !== "number" || typeof jumpAt !== "number" || typeof creditsper100msg !== "number" || probability < 0 || probability > 1) return 0;
    const iFactor = Math.log(factor) / Math.log(100000000 - probability * 100) * 0.4; // 0.4 is a factor to adjust the curve (0.4 = 40%)
    const iProbability = !!probability && Math.random() <= probability + iFactor;
    //return Math.ceil((factor / jumpAt) * iProbability)
    return (Math.ceil((factor / jumpAt) * iProbability) >= 1 ? ((factor / 100) * creditsper100msg) : 0);
};

module.exports = {
    variable_probability
}