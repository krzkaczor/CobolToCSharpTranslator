var _ = require('lodash');
var Base = require('./Base');
var SymbolExpression = require('./SymbolExpression');

module.exports = class ReturnStatement extends Base {
    constructor(expr: SymbolExpression) {
        super();
        this.expr = expr;
    }

    toSource() {
        return `return ${this.expr.toSource()};`;
    }
};