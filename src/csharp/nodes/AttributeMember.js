var _ = require('lodash');
var Base = require('./Base');
var ClassDeclaration = require('./ClassDeclaration');
var TypeRefExpr = require('./TypeReferenceExpression');

module.exports = class AttributeMember extends Base {
    constructor(name: string, type: TypeRefExpr, isStatic: ?boolean = false, initializer: ?Base, priv: ?boolean = false) {
        super();
        this.name = name;
        this._type = type;
        this.isStatic = isStatic;
        this.initializer = initializer;
        this.private = priv;
    }

    toSource() {
        return `${this.private?'private' : 'public'} ${this.isStatic?'static' : ''} ${this._type.toSource()} ${this.name} ${this.initializer? ' = ' + this.initializer.toSource() : ''};`;
    }
};