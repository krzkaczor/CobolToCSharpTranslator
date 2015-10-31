var Base = require('./Base');

module.exports = class AcceptVerb extends Base {
    constructor(target: string) {
        super();
        this.targetName = target;
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.targetName);
    }
};