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