var _ = require('lodash');
var Base = require('./Base');

//todo: proper implementation - we need to support passing ints and array of string
module.exports = class MultiplyVerb extends Base {
    constructor(target: string, value: number|string) {
        super();
        this.targetName = target;
        //if (!_.isString(value)) {
        //    this.value = value;
        //} else {
            this.coponentsNames = [value];
        //}
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.targetName);
        if (this.coponentsNames) {
            this.components = this.coponentsNames.map(comp => ctx._globalScope.get(comp));
        }
    }
};