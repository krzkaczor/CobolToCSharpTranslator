var _ = require('lodash');
var fs = require('fs');
var join = require('path').join;
var Stream = require('stream');

var Q = require('q');
var Cobol = require('cobol');

var cleanInput = require('../../src/cobol/preprocessors/removeMicrofocusDirectives');

var COBOL_SAMPLES = join(__dirname, '..', '..', 'samples');

var loadCobolProgram = function(fullPath) {
    var source = fs.readFileSync(fullPath).toString();

    return source;
};

var loadInputConfigForCobolProgram = function(cobolProgram) {
    var inputDescriptionFile = cobolProgram.replace(/cob$/, 'json');
    if (fs.existsSync(inputDescriptionFile)) {
        var inputConfig = JSON.parse(fs.readFileSync(inputDescriptionFile).toString());

        return inputConfig;
    }

    return undefined;
};

var createStreamsFromInputConfig = function(inputString) {
    var Stream = require('stream');
    var originStream = new Stream();

    originStream.pipe = function(dest) {
        inputString.forEach(function(line){dest.write(line+'\n');});
        return dest;
    };

    var streamA = new Stream.PassThrough();
    var streamB = new Stream.PassThrough();
    originStream.pipe(streamA);
    originStream.pipe(streamB);

    return [streamA, streamB];
};

/**
 * @param {String} program
 * @param {Stream} inputStream
 * @returns {*}
 */
var runCobol = function(program, inputStream) {
    program = cleanInput(program);
    var opts = {
        free: true,
        stdin: inputStream
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
  return _.trimRight(output);
};


module.exports = {
    loadCobolProgram: loadCobolProgram,
    loadInputConfigForCobolProgram: loadInputConfigForCobolProgram,
    runCobol: runCobol,
    normalizeCobolOutput: normalizeCobolOutput,
    createStreamsFromInputConfig: createStreamsFromInputConfig
};