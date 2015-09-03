var Base = require('./Base');

module.exports = class Sentence extends Base {
    constructor(stats) {
        super();
        this.statements = stats;
    }

};