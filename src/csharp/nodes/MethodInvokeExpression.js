var Base = require('./Base');

module.exports = class MethodInvokeExpression extends Base {
    /**
     *
     * @param referencedType {string}
     * @param methodName {string}
     * @param args {Array}
     */
    constructor(referencedType, methodName, args) {
        super();
        this.referencedType = referencedType;
        this.methodName = methodName;
        this.args = args;
    }

    toSource() {
        return '{0}.{1}({2});'.format(this.referencedType, this.methodName, this.args.map(arg => arg.toSource()));
    }
};