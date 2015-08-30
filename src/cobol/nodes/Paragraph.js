var Base = require('./Base');

module.exports = class Paragraph extends Base {
    constructor(stats) {
        super();
        this.statements = stats;
    }

};