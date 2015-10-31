var _ = require('lodash');
var Base = require('./Base');
var PrimitiveExpression = require('./PrimitiveExpression');
var OperatorCall = require('./OperatorCall');


module.exports = class AssignStatement {
    constructor(target: Base, value: Base, modifier: string = '') {
        this.target = target;
        this.value = value;
        this.modifier = modifier;
    }

    toSource() {
        return `${this.target.toSource()} ${this.modifier}= ${this.value.toSource()};`;
    }
};