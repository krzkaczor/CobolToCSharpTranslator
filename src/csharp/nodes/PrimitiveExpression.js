var Base = require('./Base');
var code = require('code-gen');

module.exports = class PrimitiveExpression extends Base {

    /**
     * @param primitive {string} - string representing primitive expression like 5, "a" etc.
     */
    constructor(primitive) {
        super();
        this.primitive = primitive;
    }

    toSource() {
        return code.for(this.primitive);
    }
};