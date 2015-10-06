var fs = require('fs');
var join = require('path').join;

var Q = require('q');
var Cobol = require('cobol');

var COBOL_SAMPLES = join(__dirname, '..', '..', 'samples');

var loadCobolProgram = function(fullPath) {
    var source = fs.readFileSync(fullPath).toString();

    //some examples contain unnecessary lines like setting env variables (?)
    //we will delete them here
    source = source.replace('      $ SET SOURCEFORMAT"FREE"\n', ''); //maybe it should be more generic like all lines begining with $


    return source;
};

var runCobol = function(fullPath) {
    var opts = ['-free'];

    return Q.Promise(function(resolve, reject) {
        var cobolProgram= loadCobolProgram(fullPath);
        console.log(cobolProgram);
        Cobol(cobolProgram, opts, function (err, data) {
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