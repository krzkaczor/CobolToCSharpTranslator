var path = require('path');

exports.appRequire = function(module) {
    return require(path.join('../', 'dist', module));
};

/**
 * Removes properties that cause troubles during equality checking
 * @param element
 */
exports.purge = function (element) {
    element.act(function() {
        delete this.toCSharp;
        delete this._parent;
    });
    return element;
};