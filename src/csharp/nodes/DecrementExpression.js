var Base = require('./Base');

module.exports = class DecrementExpression  extends Base {
    constructor(target: Base) {
        super();
        this.target = target;
    }

    toSource() {
        return `${this.target.toSource()}--`;
    }
};