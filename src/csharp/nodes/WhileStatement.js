var Base = require('./Base');

module.exports = class WhileStatement extends Base {
    constructor(condition: Base, stat: Base) {
        super();
        this.condition = condition;
        this.stat = stat;
    }

    toSource() {
        return `while(${this.condition.toSource()}) ${this.stat.toSource()}`;
    }
};