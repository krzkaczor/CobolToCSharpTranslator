var assert = require('chai').assert;
var ValidationTestHelpers = require('./ValidationTestHelpers');
var RunCobol = ValidationTestHelpers.RunCobol;

describe('Hello World Program', function () {
    it('should print the same output', function (done) {

        var cobolResult = RunCobol('helloworld.cob');
        var cSharpResult = RunCSharp('');

    });
});