var _ = require('lodash');
var Base = require('./Base');

module.exports = class PrimitiveExpression extends Base {
    constructor(primitive: string|number|bool) {
        super();
        this.primitive = primitive;
    }

    limitTo(n : number) {
        if (_.isNumber(this.primitive)) {
            this.primitive = parseInt(this.primitive.toString().slice(-n));
        } else {
            this.primitive = this.primitive.toString().slice(-n);
        }
        return this;
    }

    toSource() {
        if (_.isString(this.primitive)) {
            return `"${this.primitive}"`;
        }

        if (_.isBoolean(this.primitive)) {
            return `${this.primitive}`;
        }

        if (_.isNumber(this.primitive)) {
            return this.primitive;
        }
    }
};