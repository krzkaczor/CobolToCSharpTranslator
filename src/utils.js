var _ = require('lodash');

/**
 * Make given id uniq in set
 * @param id {string}
 * @param set {array}
 * @returns {*} {string}
 */
module.exports.makeUniqueInSet = function makeUniqueInSet(id, set) {
    if (set.indexOf(id) === -1) {
        return id;
    } else {
        return makeUniqueInSet('_' + id, set);
    }
};

/**
 * Removes undefined entries from array ex [1,2,undefined,3,4] becomes [1,2,3,4]
 * @param arr
 * @returns {Array|Array.<T>|*}
 */
module.exports.removeUndefinedEntries= function(arr) {
    return arr.filter(x => !_.isUndefined(x))
};