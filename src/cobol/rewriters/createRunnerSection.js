var _ = require('lodash');

var utils = require('../../utils');
var nodes = require('../nodes');

/**
 * Creates runner section
 * if it exists and it's first then it does nothing
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

        //TODO: it should be properly renamed!
        conflictingSection.name = uniqueNewName;
    }

    var paragraphs = [new nodes.Paragraph('Main', compilationUnit.procedureDivision.freeSentences)];
    if (compilationUnit.procedureDivision.freeParagraphs) {
        paragraphs = paragraphs.concat(compilationUnit.procedureDivision.freeParagraphs);
    }
    var runner = new nodes.Section('Runner', undefined, paragraphs);

    compilationUnit.procedureDivision.freeSentences = undefined;
    compilationUnit.procedureDivision.freeParagraphs = undefined;
    compilationUnit.procedureDivision.sections.unshift(runner);

    return compilationUnit;
};