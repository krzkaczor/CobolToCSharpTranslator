var _ = require('lodash');

var utils = require('../../utils');
var nodes = require('../nodes');

/**
 * Moves free statemenets in sections into new paragraphs with given name
 * @param {string} mainParagraphName
 * @param {CompilationUnit} compilationUnit
 */
module.exports = function (mainParagraphName, compilationUnit) {
    var sections = compilationUnit.procedureDivision.sections;

    sections.forEach(section => {
        if (_.isEmpty(section.freeSentences)) {
            return;
        }

        if (_.chain(section.paragraphs).filter(par => par.name == mainParagraphName).any().value()) {
            var conflictingParagraph = section.paragraphs.filter(par => par.name == mainParagraphName);
            var allParagraphsNames = sections.paragrap.map(par => par.name);

            var uniqueNewName = utils.makeUniqueInSet(conflictingParagraph.name, allParagraphsNames);

            section.renameParagraph(conflictingParagraph, uniqueNewName);
        }

        var mainParagraph = new nodes.Paragraph(mainParagraphName, section.freeSentences);
        section.freeSentences = [];
        section.unshiftParagraph(mainParagraph);
    });

    return compilationUnit;
};