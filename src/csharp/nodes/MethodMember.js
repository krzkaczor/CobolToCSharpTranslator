var Base = require('./Base');
var code = require('code-gen');

module.exports = class MethodMember extends Base {
    constructor(name, stats, isStatic) {
        super();
        this.name = name;
        this.stats = stats;
        this.isStatic = isStatic || false;
    }

    toSource() {
        return [
            code.inline([
                code.for('static').if(this.isStatic),
                code.for('void'),
                code.for(this.name)
            ]),
            code.inBrackets(code.for('')), //tofix
            code.inCurlyBrackets(code.for(this.stats).withNewLine())
        ];
    }
};