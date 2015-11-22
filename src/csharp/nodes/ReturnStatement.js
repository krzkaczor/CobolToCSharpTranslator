var _ = require('lodash');
var Base = require('./Base');

module.exports = class ReturnStatement extends Base {
    constructor(expr: ?Base) {
        super();
        this.expr = expr;
    }

    toSource() {
        if (!this.expr) {
            return 'return;';
        } else {
            return `return ${this.expr.toSource()};`;
        }
    }
};