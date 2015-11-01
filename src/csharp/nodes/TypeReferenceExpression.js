var _ = require('lodash');
var Base = require('./Base');

module.exports = class TypeReferenceExpression extends Base {
    constructor(type: Base){
        super();
        this._type = type;
    }

    toSource() {
        return this._type.name;
    }
};