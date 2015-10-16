var _ = require('lodash');
var Base = require('./Base');
var SymbolExpression = require('./SymbolExpression');

module.exports = class VariableDeclaration extends Base {
    constructor(variable: SymbolExpression, initializer: ?Base, type: ?string = 'var') {
        super();
        this.variable = variable;
        this.initializer = initializer;
        this.type = type;
    }

    toSource() {
        return `${this.type} ${this.variable.toSource()} ${this.initializer? ' = ' + this.initializer.toSource() : ''};`;
    }
};