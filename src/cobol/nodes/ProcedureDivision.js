var Base = require('./Base');

module.exports = class ProcedureDivision extends Base {
    constructor(freeSentences, sections) {
        super();
        this.freeSentences = freeSentences;
        this.sections = sections;
    }
};