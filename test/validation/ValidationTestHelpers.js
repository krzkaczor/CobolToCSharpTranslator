var fs = require('fs');
var join = require('path').join;

var Q = require('q');
var Cobol = require('cobol');

var COBOL_SAMPLES = join(__dirname, '..', '..', 'samples');

exports.loadCobolProgram = (name) => fs.readFileSync(join(COBOL_SAMPLES, name)).toString();

exports.runCobol = (name, opts) => {
    return Q.Promise((resolve, reject) => {
        Cobol(join(COBOL_SAMPLES, name), opts, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
};

exports.normalizeCobolOutput = (output) => {
  return output + "\n";
};