var _ = require('lodash');
var Base = require('./Base');
var PrimitiveExpression = require('./PrimitiveExpression');

module.exports = class MemberAccess extends Base {
    constructor(left: Base, right: Base) {
        super();
        this.left = left;
        this.right = right;
    }

    toSource() {
        if (this.left instanceof MemberAccess) {
            return `${this.left.toSource()}.${this.right.name}`;
        } else {
            return `${this.left.name}.${this.right.name}`;
        }
    }
};