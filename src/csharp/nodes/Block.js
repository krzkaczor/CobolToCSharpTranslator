var _ = require('lodash');
var Base = require('./Base');

module.exports = class Block extends Base {
    constructor(stats: Array<Base>) {
        super();
        this.stats = stats;
    }

    toSource() {
        return `{
            ${this.allToSource(this.stats).join('\n')}
        }`;
    }
};