var Base = require('./Base');
var code = require('code-gen');

module.exports = class PrimitiveExpression extends Base {
    constructor(primitive: string) {
        super();
        this.primitive = primitive;
    }

    toSource() {
        return `${this.primitive}`;
    }
};