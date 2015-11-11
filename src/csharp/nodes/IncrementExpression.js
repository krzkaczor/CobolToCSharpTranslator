var Base = require('./Base');

module.exports = class IncrementExpression  extends Base {
    constructor(target: Base) {
        super();
        this.target = target;
    }

    toSource() {
        return `${this.target.toSource()}++`;
    }
};