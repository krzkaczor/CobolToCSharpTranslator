var Base = require('./Base');

module.exports = class UnaryOperatorCall extends Base {
    constructor(operator: string, expr: Base) {
        super();
        this.operator = operator;
        this.expr = expr;
    }

    toSource() {
        return `${this.operator}(${this.expr.toSource()})`;
    }
};