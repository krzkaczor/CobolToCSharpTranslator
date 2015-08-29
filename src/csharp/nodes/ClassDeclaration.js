var Base = require('./Base');
var code = require('code-gen');

module.exports = class ClassDeclaration extends Base {
    constructor(name, members) {
        super();
        this.name = name;
        this.members = members;
    }

    toSource() {
        return [
            code.inline([
                code.for('class'),
                code.for(this.name)
            ]),
            code.inCurlyBrackets(code.for(this.members).withNewLine())
        ];
    }
};