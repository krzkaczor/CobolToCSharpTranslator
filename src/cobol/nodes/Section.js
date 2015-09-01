var _ = require('lodash');
var Base = require('./Base');

const DEFAULT_SECTION_NAME = 'Runner';

module.exports = class Section extends Base {
    constructor(name, freeSentences, paragraphs) {
        super();
        this.name = name;
        this.freeSentences = freeSentences;
        this.paragraphs = paragraphs;
    }

    isRunner() {
        return _.isUndefined(this.name);
    }
};