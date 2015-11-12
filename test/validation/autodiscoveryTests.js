var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var expect = require('chai').expect
var Q = require('q');
var _ = require('lodash');

var ValidationTestHelpers = require('./ValidationTestHelpers');
var runCSharp = require('node-csharp');
var loadCobolProgram = ValidationTestHelpers.loadCobolProgram;
var loadInputConfigForCobolProgram = ValidationTestHelpers.loadInputConfigForCobolProgram;
var createStreamsFromInputConfig = ValidationTestHelpers.createStreamsFromInputConfig;
var runCobol = ValidationTestHelpers.runCobol;

var CobolToCSharpTranslator = require('../../dist/CobolToCSharpTranslator');
var cobolToCSharpTranslator = new CobolToCSharpTranslator();

const VALIDATION_TESTS_DIR = path.join(__dirname, '..', '..', 'samples');

const ignoredFiles = ['nextFeature.cob', 'Accept.cob'];

//const runOnly = ['acceptWorkingStorage.cob'];

autodiscoverDir(VALIDATION_TESTS_DIR);

/**
 * Recursive discovery of test cases
 * @param {string} dir
 */
function autodiscoverDir(dir) {
    var files = fs.readdirSync(dir);

    files
        .filter(function(file) {return _.endsWith(file, 'cob');})
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
    if (typeof runOnly !== 'undefined' && !_.isEmpty(runOnly) && !_.contains(runOnly, file)) {
        return;
    }

    //should be duplicated
    var inputConfig = loadInputConfigForCobolProgram(fullPath);

    if (!inputConfig) {
        inputConfig = { 'should print the same output':[] };
    }

    describe(file + ' tests:', function () {
        _.forOwn(inputConfig, function(input, testCase) {
            var streams = createStreamsFromInputConfig(input);
            var cobolInputStream = streams[0];
            var csInputStream = streams[1];

            it(testCase, function (done) {
                var cobolProgram = loadCobolProgram(fullPath);
                var translatedProgram = cobolToCSharpTranslator.getCSharpCode(cobolProgram);

                var cobolResultPromise = runCobol(cobolProgram, cobolInputStream);
                var cSharpResultPromise = runCSharp.fromString(translatedProgram, {stdin:csInputStream});

                Q.all([cobolResultPromise, cSharpResultPromise]).then(function (res) {
                    var cobolResult = ValidationTestHelpers.normalizeCobolOutput(res[0]);
                    var cSharpResult = ValidationTestHelpers.normalizeCobolOutput(res[1]);

                    expect(cobolResult).to.be.equal(cSharpResult);

                    console.log("Test run successfully\n");
                    done();
                }).catch(function (err) {
                    console.log(err);
                    assert.fail(err);
                });
            });
        });
    });
}