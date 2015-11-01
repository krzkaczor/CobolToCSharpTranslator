var Base = require('./Base');

module.exports = class PerformUntilVerb extends Base {
    constructor(condition: Base, stats: Array<Base>) {
        super();
        this.condition = condition;
        this.stats = stats;
    }
};