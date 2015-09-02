var path = require('path');

exports.appRequire = function(module) {
    return require(path.join(__dirname,  '../', 'dist', module));
};