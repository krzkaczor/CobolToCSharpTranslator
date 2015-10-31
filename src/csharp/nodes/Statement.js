var _ = require('lodash');
var Base = require('./Base');

module.exports = class Statement extends Base {
    constructor(expr: Base){
        super();
        this.expr = expr;
    }

    toSource() {
        return `${this.expr.toSource()};`;
    }
};