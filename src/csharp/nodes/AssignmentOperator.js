var _ = require('lodash');
var Base = require('./Base');
var PrimitiveExpression = require('./PrimitiveExpression');

module.exports = class AssignmentOperator extends Base {
    constructor(target: Base, value: Base) {
        super();
        this.target = target;
        this.value = value;
    }

    toSource() {
        return `${this.target.toSource()} = ${this.value.toSource()};`;
    }
};