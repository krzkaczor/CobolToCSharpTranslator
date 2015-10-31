var _ = require('lodash');
var Base = require('./Base');
var PrimitiveExpression = require('./PrimitiveExpression');
var OperatorCall = require('./OperatorCall');


module.exports = class ParameterDeclaration {
    constructor(type: Base, name: string) {
        this._type = type;
        this.name = name;
    }

    toSource() {
        return `${this._type.toSource()} ${this.name}`;
    }
};