var Base = require('./Base');

module.exports = class MoveVerb extends Base {
    constructor(target: string, value: Base) {
        super();
        this.where = target;
        this.what = value;
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.where);
    }
};