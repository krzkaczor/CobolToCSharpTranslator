var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var expect = require('chai').expect
var Q = require('q');
var _ = require('lodash');

var ValidationTestHelpers = require('./ValidationTestHelpers');
var runCSharp = require('node-csharp');
var loadCobolProgram = ValidationTestHelpers.loadCobolProgram;
var runCobol = ValidationTestHelpers.runCobol;

var CobolToCSharpTranslator = require('../../dist/CobolToCSharpTranslator');
var cobolToCSharpTranslator = new CobolToCSharpTranslator();

const VALIDATION_TESTS_DIR = path.join(__dirname, '..', '..', 'samples');

const ignoredFiles = ['basicData.cob'];

autodiscoverDir(VALIDATION_TESTS_DIR);

/**
 * Recursive discovery of test cases
 * @param {string} dir
 */
function autodiscoverDir(dir) {
    var files = fs.readdirSync(dir);

    files
        .filter(function(file) {return !_.contains(ignoredFiles, file);})
        .forEach(function(file) {
        var fullPath = path.join(dir, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            autodiscoverDir(fullPath);
        } else {
            makeTest(file, fullPath);
        }
    });
}

function makeTest(file, fullPath) {
    describe(file + ' tests:', function () {
        it('should print the same output', function (done) {
            var cobolProgram = loadCobolProgram(fullPath);
            var translatedProgram = cobolToCSharpTranslator.getCSharpCode(cobolProgram);

            var cobolResultPromise = runCobol(fullPath);
            var cSharpResultPromise = runCSharp.fromString(translatedProgram);

            Q.all([cobolResultPromise, cSharpResultPromise]).then(function (res) {
                var cobolResult = ValidationTestHelpers.normalizeCobolOutput(res[0]);
                var cSharpResult = res[1];
                expect(cobolResult).to.be.equal(cSharpResult);

                done();
            }).catch(function (err) {
                console.log(err);
                assert.fail(err);
            });
        });
    });
}