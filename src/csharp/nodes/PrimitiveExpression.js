var _ = require('lodash');
var Base = require('./Base');

module.exports = class PrimitiveExpression extends Base {
    constructor(primitive: string|number|bool) {
        super();
        this.primitive = primitive;
    }

    toSource() {
        if (_.isString(this.primitive) || _.isBoolean(this.primitive)) {
            return `"${this.primitive}"`;
        }

        if (_.isNumber(this.primitive)) {
            return this.primitive;
        }
    }
};