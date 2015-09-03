var Base = require('./Base');

module.exports = class ProcedureDivision extends Base {
    constructor(freeSentences, freeParagraphs, sections) {
        super();
        this.freeSentences = freeSentences;
        this.freeParagraphs = freeParagraphs;
        this.sections = sections;
    }
};