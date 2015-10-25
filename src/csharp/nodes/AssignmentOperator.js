var _ = require('lodash');
var Base = require('./Base');
var PrimitiveExpression = require('./PrimitiveExpression');
var OperatorCall = require('./OperatorCall');


module.exports = class AssignmentOperator extends OperatorCall {
    constructor(target: Base, value: Base) {
        super('=', target, value);
    }
};