var Base = require('./Base');
var Paragraph = require('./Paragraph');
var Section = require('./Section');

module.exports = class ProcedureDivision extends Base {
    constructor(freeSentences: Array<Base>, freeParagraphs: Array<Paragraph>, sections: Array<Section>) {
        super();
        this.freeSentences = freeSentences;
        this.freeParagraphs = freeParagraphs;
        this.sections = sections;
    }
};