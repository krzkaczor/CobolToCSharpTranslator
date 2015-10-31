var _ =  require('lodash');
var actOnNodes = require('../../common/actOnNodes');

module.exports = class Base {
    constructor() {
        this.TYPE = "cobol." + this.constructor.name;
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

    bindToCSharp(csharpEl) {
        this._csharpRef = csharpEl;
        return this;
    }
};