var _ = require('lodash');
var Base = require('./Base');
var PrimitiveExpression = require('./PrimitiveExpression');

module.exports = class IfStatement extends Base {
    constructor(condition: Base, trueStats: Base, falseStats: ?Base) {
        super();
        this.condition = condition;
        this.trueStats = trueStats;
        this.falseStats = falseStats;
    }

    toSource() {
        if (this.falseStats === undefined) {
            return `if(${this.condition.toSource()}) ${this.trueStats.toSource()} `;
        } else {
            return `if(${this.condition.toSource()}) ${this.trueStats.toSource()} else ${this.falseStats.toSource()}`;
        }

    }
};