var Base = require('./Base');

module.exports = class PrimitiveExpression extends Base {
    constructor(primitive: string) {
        super();
        this.primitive = primitive;
    }

    toSource() {
        return `${this.primitive}`;
    }
};