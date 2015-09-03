var Base = require('./Base');

module.exports = class GoToVerb extends Base {
    constructor(targetName) {
        super();
        this.targetName = targetName;
    }

    analyze(ctx) {
        this.target = ctx.symbolTable.get(this.targetName);
    }
};