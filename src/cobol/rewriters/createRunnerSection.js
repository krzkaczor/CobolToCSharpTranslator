var _ = require('lodash');

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
        throw new Error('name conflict');
    }
};