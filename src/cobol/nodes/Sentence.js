var Base = require('./Base');

module.exports = class Sentence extends Base {
    constructor(stats: Array<Base>) {
        super();
        this.statements = stats;
    }

};