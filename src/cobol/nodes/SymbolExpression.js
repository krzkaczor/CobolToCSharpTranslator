var Base = require('./Base');

module.exports = class SymbolExpression extends Base {
    constructor(what: string) {
        super();
        this.what = what;
    }

    analyze(ctx) {
        this.target = ctx._globalScope.get(this.what);
    }
};