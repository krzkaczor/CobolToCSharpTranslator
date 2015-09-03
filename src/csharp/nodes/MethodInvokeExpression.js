var _ = require('lodash');
var Base = require('./Base');

module.exports = class MethodInvokeExpression extends Base {
    /**
     *
     * @param reference {string}
     * @param args {Array}
     */
    constructor(reference, args) {
        super();
        this.reference = reference;
        this.args = args;
    }

    toSource() {
        if (_.isString(this.reference)) {
            return `${this.reference}(${this.allToSource(this.args)});`;
        } else {
            return `${this.reference.name}(${this.allToSource(this.args)});`;
        }
    }
};