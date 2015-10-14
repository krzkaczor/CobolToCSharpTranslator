var _ = require('lodash');
var Base = require('./Base');
var ClassDeclaration = require('./ClassDeclaration');

module.exports = class AttributeMember extends Base {
    constructor(name: string, type: ClassDeclaration, isStatic: boolean) {
        super();
        this.name = name;
        this._type = type;
        this.isStatic = isStatic;
    }

    toSource() {
        return `public ${this._type.name} ${this.name};`;
    }
};