var assert = require('chai').assert;
var expect = require('chai').expect;

var appRequire = require('../../testHelper').appRequire;

var createRunnerSectionRewritter = appRequire('cobol/rewriters/createRunnerSection.js');
var nodes = appRequire('cobol/nodes');

describe('Create runner section rewriter', function () {
    it('should add runner and move free statements', function () {
        var otherSection = {
            name:'OtherSection'
        };

        var freeSentences = [new nodes.Sentence([new nodes.DisplayVerb(new nodes.StringLiteral('abc'))])];

        var cobolProgram = {
            procedureDivision: {
                freeSentences: freeSentences,
                sections: [
                    otherSection
                ]
            }
        };

        createRunnerSectionRewritter('Runner', cobolProgram);

        expect(cobolProgram.procedureDivision.sections[0]).to.be.eql(new nodes.Section('Runner', undefined, [new nodes.Paragraph('Main', freeSentences)]));
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

        expect(cobolProgram.procedureDivision.sections[0]).to.be.eql(new nodes.Section('Runner', undefined, [new nodes.Paragraph('Main')]));
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

        expect(cobolProgram.procedureDivision.sections[0]).to.be.eql(new nodes.Section('Runner', undefined, [new nodes.Paragraph('Main')]));
        expect(cobolProgram.procedureDivision.sections[1]).to.be.eql({name: '__Runner'});
    });
});