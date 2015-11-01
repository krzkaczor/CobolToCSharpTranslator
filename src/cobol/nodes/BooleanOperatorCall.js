var Base = require('./Base');

module.exports = class BooleanOperatorCall extends Base {
    constructor(operator: string, left: Base, right: Base) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
};