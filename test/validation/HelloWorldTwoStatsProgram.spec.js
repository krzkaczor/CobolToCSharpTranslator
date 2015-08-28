var assert = require('chai').assert;
var expect = require('chai').expect;

var Q = require('q');

var ValidationTestHelpers = require('./ValidationTestHelpers');
var runCSharp = require('node-csharp');
var loadCobolProgram = ValidationTestHelpers.loadCobolProgram;
var runCobol = ValidationTestHelpers.runCobol;

var CobolToCSharpTranslator = require('../../dist/CobolToCSharpTranslator'); //@FIX
var cobolToCSharpTranslator = new CobolToCSharpTranslator();

describe('Hello World Two Stats Program', function () {
    const TESTED_PROGRAM = 'helloworldTwoStats.cob';

    it('should print the same output', function (done) {
        var cobolProgram = loadCobolProgram(TESTED_PROGRAM);
        var translatedProgram = cobolToCSharpTranslator.emitCSharp(cobolProgram);

        var cobolResultPromise = runCobol(TESTED_PROGRAM);
        var cSharpResultPromise = runCSharp.fromString(translatedProgram);

        Q.all([cobolResultPromise, cSharpResultPromise]).then(function(res) {
            var cobolResult = ValidationTestHelpers.normalizeCobolOutput(res[0]);
            var cSharpResult = res[1];
            expect(cobolResult).to.be.equal(cSharpResult);
            done();
        }).catch(res => {
            console.log(res);
            assert.fail();
            done();
        });
    });
});