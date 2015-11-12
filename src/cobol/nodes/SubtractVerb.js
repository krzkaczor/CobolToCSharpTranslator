var _ = require('lodash');
var Base = require('./Base');

module.exports = class SubtractVerb extends Base {
    constructor(target: string, from: Base, value: Array<Base>) {
        super();
        this.targetName = target;
        this.fromName = from;
        this.components = value;
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.targetName);
    }
};