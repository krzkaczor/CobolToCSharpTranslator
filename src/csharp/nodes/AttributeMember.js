var _ = require('lodash');
var Base = require('./Base');
var ClassDeclaration = require('./ClassDeclaration');

module.exports = class AttributeMember extends Base {
    constructor(name: string, type: ClassDeclaration, isStatic: ?boolean = false, initializer: ?Base) {
        super();
        this.name = name;
        this._type = type;
        this.isStatic = isStatic;
        this.initializer = initializer;
    }

    toSource() {
        return `public ${this.isStatic?'static' : ''} ${this._type.name} ${this.name} ${this.initializer? ' = ' + this.initializer.toSource() : ''};`;
    }
};