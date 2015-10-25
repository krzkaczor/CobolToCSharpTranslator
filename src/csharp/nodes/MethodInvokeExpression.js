var _ = require('lodash');
var Base = require('./Base');
var RawExpression = require('./RawExpression');
var MemberAccess = require('./MemberAccess');

module.exports = class MethodInvokeExpression extends Base {
    constructor(reference : Base, args: ?Array<Base> = []) {
        super();
        this._reference = reference;
        this.args = args;
    }

    toSource() {
        var MethodMember = require('./MethodMember');
        if (this._reference instanceof RawExpression) {
            return `${this._reference.toSource()}(${this.allToSource(this.args)});`;
        }

        if (this._reference instanceof MethodMember) {
            return `${this._reference._parent.name}.${this._reference.name}(${this.allToSource(this.args)});`;
        }

        return `${this._reference.name}(${this.allToSource(this.args)});`;
    }
};