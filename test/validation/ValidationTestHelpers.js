var fs = require('fs');
var join = require('path').join;

var Q = require('q');
var Cobol = require('cobol');

var cleanInput = require('../../src/cobol/preprocessors/removeMicrofocusDirectives');

var COBOL_SAMPLES = join(__dirname, '..', '..', 'samples');

var loadCobolProgram = function(fullPath) {
    var source = fs.readFileSync(fullPath).toString();

    return source;
};

/**
 * @param {String} program
 * @returns {*}
 */
var runCobol = function(program) {
    program = cleanInput(program);

    var opts = {
        free: true
    };

    if (require('os').platform() == 'linux') {
        opts.cobcArgs = '-O';
    }

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