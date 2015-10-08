var fs = require('fs');
var join = require('path').join;

var Q = require('q');
var Cobol = require('cobol');

var COBOL_SAMPLES = join(__dirname, '..', '..', 'samples');

var loadCobolProgram = function(fullPath) {
    var source = fs.readFileSync(fullPath).toString();



    return source;
};

/**
 *
 * @param {String} program
 * @returns {*}
 */
var runCobol = function(program) {
    var opts = {
        free: true
    };

    return Q.Promise(function(resolve, reject) {
        Cobol(program, opts, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
};

var normalizeCobolOutput = function(output) {
  return output + "\n";
};


module.exports = {
    loadCobolProgram: loadCobolProgram,
    runCobol: runCobol,
    normalizeCobolOutput: normalizeCobolOutput
}