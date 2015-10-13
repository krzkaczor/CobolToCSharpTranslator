var assert = require('chai').assert;
var expect = require('chai').expect;

var appRequire = require('../../testHelper').appRequire;
var purge = require('../../testHelper').purge;

var hierarchizeWorkingStorage = appRequire('cobol/rewriters/hierarchizeWorkingStorage.js');
var nodes = appRequire('cobol/nodes');

//mocks
var GroupItem = function(lvl, name) {
    this.level = lvl;
    this.name = name;
    this.children = [];
};

var ElementaryItem = function(lvl, name) {
    this.level = lvl;
    this.name = name;
};

describe('Hierarchize working storage ', function () {

    it('should hierarchize', function () {
        var cobolProgram = {
            dataDivision: {
                workingStorageSection : {
                    variables: [
                        new GroupItem(1, 'A'),
                        new GroupItem(2, 'B'),
                        new ElementaryItem(3, 'C'),
                        new ElementaryItem(3, 'D'),
                        new GroupItem(2, 'Z'),
                        new ElementaryItem(3, 'X'),
                        new ElementaryItem(2, 'Y'),
                        new ElementaryItem(1, 'E')
                    ]
                }
            }
        };

        hierarchizeWorkingStorage(cobolProgram);

        var workingStorage = cobolProgram.dataDivision.workingStorageSection.variables;

        expect(workingStorage.length).to.be.eq(2);
        expect(workingStorage[0].children.length).to.be.eq(3);
        expect(workingStorage[1].name).to.be.eq('E');
        expect(workingStorage[0].children[0].children[0].name).to.be.eq('C');
        expect(workingStorage[0].children[0].children[1].name).to.be.eq('D');
        expect(workingStorage[0].children[1].children[0].name).to.be.eq('X');
        expect(workingStorage[0].children[2].name).to.be.eq('Y');
    });
});