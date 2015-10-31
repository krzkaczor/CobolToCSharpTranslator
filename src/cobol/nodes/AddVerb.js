var _ = require('lodash');
var Base = require('./Base');

module.exports = class AddVerb extends Base {
    constructor(target: string, value: number|Array<string>) {
        super();
        this.targetName = target;
        if (!_.isArray(value)) {
            this.value = value;
        } else {
            this.coponentsNames = value;
        }
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.targetName);
        if (this.coponentsNames) {
            this.components = this.coponentsNames.map(comp => ctx._globalScope.get(comp));
        }
    }
};