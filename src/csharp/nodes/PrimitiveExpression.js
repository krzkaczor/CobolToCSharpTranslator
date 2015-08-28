var Base = require('./Base');

module.exports = class PrimitiveExpression extends Base {

    /**
     * @param primitive {string} - string representing primitive expression like 5, "a" etc.
     */
    constructor(primitive) {
        super();
        this.primitive = primitive;
    }

    toSource() {
        return this.primitive;
    }
};