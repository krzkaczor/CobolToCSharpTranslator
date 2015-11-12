var _ = require('lodash');
var Base = require('./Base');

module.exports = class DivideVerb extends Base {
    constructor(target: string, value: Array<Base>, remainderName: ?string) {
        super();
        this.targetName = target;
        this.remainderName = remainderName;
        this.components = value;
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.targetName);
        if (this.remainderName) {
            this.remainder = ctx._globalScope.get(this.remainderName);
        }
    }
};