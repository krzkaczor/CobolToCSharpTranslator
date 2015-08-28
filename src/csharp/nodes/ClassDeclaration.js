var Base = require('./Base');

module.exports = class ClassDeclaration extends Base {
    constructor(name, members) {
        super();
        this.name = name;
        this.members = members;
    }

    toSource() {
        return "class {0} {\n{1}}\n".format(this.name, this.members.map(member => member.toSource()).reduce((a, b) => a+b, ""));
    }
};