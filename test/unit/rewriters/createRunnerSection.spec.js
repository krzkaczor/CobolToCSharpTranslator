var assert = require('chai').assert;
var expect = require('chai').expect;

var appRequire = require('../../testHelper').appRequire;

var createRunnerSectionRewritter = appRequire('cobol/rewriters/createRunnerSection.js');
var nodes = appRequire('cobol/nodes');

describe.only('Create runner section rewriter', function () {
    it('should add runner', function () {
        var otherSection = {
            name:'OtherSection'
        };

        var cobolProgram = {
            procedureDivision: {
                sections: [
                    otherSection
                ]
            }
        };

        createRunnerSectionRewritter('Runner', cobolProgram);

        expect(cobolProgram.procedureDivision.sections[0]).to.be.eql(new nodes.Section('Runner'));
        expect(cobolProgram.procedureDivision.sections[1]).to.be.eql(otherSection);
    });

    it('should detect name conflict', function () {
        var otherSection = {
            name:'Runner'
        };

        var cobolProgram = {
            procedureDivision: {
                sections: [
                    otherSection
                ]
            }
        };

        createRunnerSectionRewritter('Runner', cobolProgram);

        expect(cobolProgram.procedureDivision.sections[0]).to.be.eql(new nodes.Section('Runner'));
        expect(cobolProgram.procedureDivision.sections[1]).to.be.eql({name: '_Runner'});
    });

    it('should detect double name conflict', function () {
        var cobolProgram = {
            procedureDivision: {
                sections: [
                    {
                        name: 'Runner'
                    },
                    {
                        name: '_Runner'
                    }
                ]
            }
        };

        createRunnerSectionRewritter('Runner', cobolProgram);

        expect(cobolProgram.procedureDivision.sections[0]).to.be.eql(new nodes.Section('Runner'));
        expect(cobolProgram.procedureDivision.sections[1]).to.be.eql({name: '__Runner'});
    });
});