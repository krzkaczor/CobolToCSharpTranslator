var assert = require('chai').assert;
var expect = require('chai').expect;

var appRequire = require('../../testHelper').appRequire;

var createRunnerSectionRewritter = appRequire('cobol/rewriters/createRunnerSection.js');

describe.only('Create runner section rewriter', function () {
    it('should detect name conflict', function () {
        var cobolProgram = {
            procedureDivision: {
                sections: [
                    {
                        name:'Runner'
                    }
                ]
            }
        };

        createRunnerSectionRewritter('Runner', cobolProgram);
    });
});