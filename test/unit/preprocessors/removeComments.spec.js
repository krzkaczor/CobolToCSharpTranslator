var assert = require('chai').assert;
var expect = require('chai').expect;

var appRequire = require('../../testHelper').appRequire;

var removeComments = appRequire('cobol/preprocessors/removeComments');

describe('Remove comments', function () {
    it('should remove valid cobol comments', function () {
        var source = '* something';
        expect(removeComments(source)).to.be.empty;
    });

    it('should remove valid cobol comments with whitespaces', function () {
        var source = '  * something';
        expect(removeComments(source)).to.be.empty;
    });

    it('should remove valid cobol comments with new line', function () {
        var source = '  * something\n';
        expect(removeComments(source)).to.be.empty;
    });

    it('should not remove in code multiply character', function () {
        var source = ' 2 * 2';
        expect(removeComments(source)).to.be.eq(source);
    });

    it('should remove only comments', function () {
        var source = ' 2 * 2\ntest\n*comment\na';
        expect(removeComments(source)).to.be.eq(' 2 * 2\ntest\na');
    });
});