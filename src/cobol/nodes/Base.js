var _ =  require('lodash');

module.exports = class Base {
    constructor() {
        this.TYPE = "cobol." + this.constructor.name;
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
};