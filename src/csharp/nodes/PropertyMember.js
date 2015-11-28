var _ = require('lodash');
var Base = require('./Base');
var ClassDeclaration = require('./ClassDeclaration');
var TypeRefExpr = require('./TypeReferenceExpression');

module.exports = class PropertyMember extends Base {
    constructor(name: string, type: TypeRefExpr, isStatic: ?boolean = false, getter: ?Array<Base>, setter: ?Array<Base>) {
        super();
        this.name = name;
        this._type = type;
        this.isStatic = isStatic;
        this.getter = getter;
        this.setter = setter;
    }

    toSource() {
        return `public ${this.isStatic?'static' : ''} ${this._type.toSource()} ${this.name} {
            ${this.getter?`get { ${this.allToSource(this.getter).join('\n')}}`:`` }
            ${this.setter?`set { ${this.allToSource(this.setter).join('\n')}}`:`` }
        }`;
    }
};