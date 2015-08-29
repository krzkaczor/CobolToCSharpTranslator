var Base = require('./Base');
var code = require('code-gen');

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
        return [
            code.for(this.referencedType),
            code.for('.'),
            code.for(this.methodName),
            code.inBrackets(code.for(this.args).commaSeparated()).endingWith(';')
        ];
    }
};