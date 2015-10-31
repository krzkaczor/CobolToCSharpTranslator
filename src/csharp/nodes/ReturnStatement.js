var _ = require('lodash');
var Base = require('./Base');
var VariableReferenceExpression = require('./VariableReferenceExpression');

module.exports = class ReturnStatement extends Base {
    constructor(expr: VariableReferenceExpression) {
        super();
        this.expr = expr;
    }

    toSource() {
        return `return ${this.expr.toSource()};`;
    }
};