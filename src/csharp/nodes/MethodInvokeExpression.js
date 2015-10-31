var _ = require('lodash');
var Base = require('./Base');
var RawExpression = require('./RawExpression');

module.exports = class MethodInvokeExpression extends Base {
    constructor(reference: Base, methodName: string, args: ?Array<Base> = []) {
        super();
        this.reference = reference;
        this.methodName = methodName;
        this.args = args;
    }

    toSource() {
        return `${this.reference.toSource()}.${this.methodName}(${this.allToSource(this.args)})`;
    }
};