if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}


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