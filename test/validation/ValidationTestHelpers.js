var path = require('path');

var Q = require('q');
var Cobol = require('cobol');

var COBOL_SAMPLES = path.join(__dirname, '..', '..', 'samples');

exports.RunCobol = (name, opts) => {
    return Q.Promise((resolve, reject) => {
        Cobol(path.join(COBOL_SAMPLES, name), opts, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
};

exports.RunCSharp = (name, opts) => {

};