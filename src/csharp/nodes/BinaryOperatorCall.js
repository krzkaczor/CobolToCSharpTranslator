var _ = require('lodash');
var Base = require('./Base');

module.exports = class BinaryOperatorCall extends Base {
    constructor(operator: string, left: Base, right: Base) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    toSource() {
        return `${this.left.toSource()} ${this.operator} ${this.right.toSource()}`;
    }
};