var _ =  require('lodash');

module.exports = class Base {
    constructor() {
        this.TYPE = "csharp." + this.constructor.name;
    }

    bindWithParent(child) {
        if (_.isArray(child)) {
            child.forEach( c => this.bindWithParent(c));
        }

        if (child instanceof Base) {
            child.parent = this;
        }

        return child;
    }

    toSource() {
        throw new Error('unimplemented');
    }
};