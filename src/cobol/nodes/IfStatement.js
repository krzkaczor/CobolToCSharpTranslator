var Base = require('./Base');

module.exports = class IfStatement extends Base {
    constructor(condition: Base, trueStatements: Array<Base>, falseStatements: ?Array<Base>) {
        super();
        this.condition = condition;
        this.trueStatements = trueStatements;
        this.falseStatements = falseStatements;
    }
};