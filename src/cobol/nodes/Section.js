var _ = require('lodash');
var Base = require('./Base');

const DEFAULT_SECTION_NAME = 'Runner';

module.exports = class Section extends Base {
    constructor(paragraphs, name) {
        super();
        this.paragraphs = paragraphs;
        this.name = name || DEFAULT_SECTION_NAME;
    }

    isRunner() {
        return _.isUndefined(this.name);
    }
};