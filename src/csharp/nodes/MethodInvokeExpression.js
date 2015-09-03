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
        this._reference = reference;
        this.args = args;
    }

    toSource() {
        if (_.isString(this._reference)) {
            return `${this._reference}(${this.allToSource(this.args)});`;
        } else {
            return `${this._reference._parent.name}.${this._reference.name}(${this.allToSource(this.args)});`;
        }
    }
};