var _ = require('lodash');

var utils = require('../../utils');
var nodes = require('../nodes');

/**
 * Creates runner section
 * if it exitsts and it's first then it does nothing
 * otherwise it renames it
 * @param {string} runnerSectionName
 * @param {CompilationUnit} compilationUnit
 */
module.exports = function(runnerSectionName, compilationUnit) {
    var sections = compilationUnit.procedureDivision.sections;

    if (_.chain(sections).filter(section => section.name === runnerSectionName).any().value()) {
        var conflictingSection = sections.filter(section => section.name === runnerSectionName)[0];
        var allSectionsNames = sections.map(section => section.name);

        var uniqueNewName = utils.makeUniqueInSet(conflictingSection.name, allSectionsNames);

        debugger;
        //TODO: it should be properly renamed!
        conflictingSection.name = uniqueNewName;
    }

    compilationUnit.procedureDivision.sections.unshift(new nodes.Section('Runner'));
};