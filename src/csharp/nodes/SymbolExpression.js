var _ = require('lodash');
var Base = require('./Base');

module.exports = class SymbolExpression extends Base {
    constructor(name: string) {
        super();
        this.name = name;
    }

    toSource() {
        return this.name;
    }
};