var _ = require('lodash');
var Base = require('./Base');

//todo: proper implementation - we need to support passing ints and array of string
module.exports = class MultiplyVerb extends Base {
    constructor(target: string, value: Array<Base>) {
        super();
        this.targetName = target;
        this.components = value;
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.targetName);
    }
};