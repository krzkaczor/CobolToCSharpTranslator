var _ = require('lodash');
var Base = require('./Base');

module.exports = class AddVerb extends Base {
    constructor(target: string, value: Array<Base>) {
        super();
        this.targetName = target;
        this.components = value;
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.targetName);
    }
};