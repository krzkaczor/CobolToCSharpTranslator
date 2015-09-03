var _ =  require('lodash');

module.exports = class Base {
    constructor() {
        this.TYPE = "csharp." + this.constructor.name;
    }

    bindWithParent(parent) {
        var bindBaseElement = (element) => {
            if (element instanceof Base) {
                element.bindWithParent(this);
            }
        };

        _.pairs(this).filter(kv=> !_.startsWith(kv[0], '_')).map(kv => kv[1]).forEach(element => {
            if (_.isArray(element)) {
                element.forEach(bindBaseElement);
            } else {
                bindBaseElement(element);
            }
        });

        if (parent) {
            this._parent = parent;
        }
    }

    toSource() {
        throw new Error('unimplemented');
    }

    allToSource(arr) {
        return arr.map(decl => decl.toSource?decl.toSource(): decl);
    }
};