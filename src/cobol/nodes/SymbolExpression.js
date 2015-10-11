var Base = require('./Base');

module.exports = class SymbolExpression extends Base {
    constructor(what) {
        super();
        this.what = what;
    }
};