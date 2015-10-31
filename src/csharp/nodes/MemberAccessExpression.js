var _ = require('lodash');
var Base = require('./Base');
var PrimitiveExpression = require('./PrimitiveExpression');

module.exports = class MemberAccessExpression extends Base {
    constructor(left: Base, right: string) {
        super();
        this.left = left;
        this.right = right;
    }

    toSource() {
        return `${this.left.toSource()}.${this.right}`;
    }
};