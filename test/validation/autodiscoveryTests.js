var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var expect = require('chai').expect
var Q = require('q');

var ValidationTestHelpers = require('./ValidationTestHelpers');
var runCSharp = require('node-csharp');
var loadCobolProgram = ValidationTestHelpers.loadCobolProgram;
var runCobol = ValidationTestHelpers.runCobol;

var CobolToCSharpTranslator = require('../../dist/CobolToCSharpTranslator');
var cobolToCSharpTranslator = new CobolToCSharpTranslator();

const VALIDATION_TESTS_DIR = path.join(__dirname, '..', '..', 'samples');
var files = fs.readdirSync(VALIDATION_TESTS_DIR);

files.forEach(function(file) {

    describe(file + ' tests:', function() {
        it('should print the same output', function(done) {
            var cobolProgram = loadCobolProgram(file);
            var translatedProgram = cobolToCSharpTranslator.getCSharpCode(cobolProgram);

            var cobolResultPromise = runCobol(file);
            var cSharpResultPromise = runCSharp.fromString(translatedProgram);

            Q.all([cobolResultPromise, cSharpResultPromise]).then(function(res) {
                var cobolResult = ValidationTestHelpers.normalizeCobolOutput(res[0]);
                var cSharpResult = res[1];
                expect(cobolResult).to.be.equal(cSharpResult);

                done();
            }).catch(function(err) {
                console.log(err);
                assert.fail(err);
            });
        });
    });
});