var Base = require('./Base');

module.exports = class WhenCase extends Base {
    constructor(condition: Base, statements: Array<Base>) {
        super();
        this.condition = condition;
        this.statements = statements;
    }
};