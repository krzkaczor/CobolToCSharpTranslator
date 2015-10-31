var _ =  require('lodash');
var actOnNodes = require('../../common/actOnNodes');
var CobolBase = require('../../cobol/nodes/Base');

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

    act() {
        return actOnNodes(this, ...arguments);
    }

    bindWithCounterpart(counterPart: CobolBase) {
        this.bindToCobol(counterPart);
        counterPart.bindToCSharp(this);

        return this;
    }

    bindToCobol(cobolOrigin: CobolBase) {
        this._cobolRef = cobolOrigin;
        return this;
    }

    toSource() {
        throw new Error('unimplemented');
    }

    allToSource(arr) {
        return arr.map(decl => decl.toSource?decl.toSource(): decl);
    }
};