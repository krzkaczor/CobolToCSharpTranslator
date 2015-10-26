var Base = require('./Base');

module.exports = class PerformVerb extends Base {
    constructor(targetName: string, times: ?number = 1) {
        super();
        this.targetName = targetName;
        this.times = times;
    }

    analyze(ctx) {
        this.target = ctx.symbolTable.get(this.targetName);
    }
};