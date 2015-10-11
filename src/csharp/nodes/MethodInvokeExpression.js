var _ = require('lodash');
var Base = require('./Base');

module.exports = class MethodInvokeExpression extends Base {
    constructor(reference : string|Base, args: ?Array<Base>) {
        super();
        this._reference = reference;
        this.args = args || [];
    }

    toSource() {
        if (_.isString(this._reference)) {
            return `${this._reference}(${this.allToSource(this.args)});`;
        } else {
            if (this.goTo) {
                this._reference = this._reference.findCompanion();
            }

            return `${this._reference._parent.name}.${this._reference.name}(${this.allToSource(this.args)});`;
        }
    }
};