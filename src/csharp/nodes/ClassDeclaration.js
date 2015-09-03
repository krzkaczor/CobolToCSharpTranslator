var _ = require('lodash');
var Base = require('./Base');

module.exports = class ClassDeclaration extends Base {
    constructor(name, members) {
        super();

        if (name == 'Main') {
            name = 'MainCls';
        }

        this.name = name;
        this.members = members;
    }

    getNextMember(member) {
        var nextMethod =  this.members[_.findIndex(this.members, mem => mem === member) + 1];
        if (nextMethod === undefined) {
            if(this._parent.getNextClass(this) === undefined) {
                return;
            }
            nextMethod = this._parent.getNextClass(this).getFirstMember();
        }
        return nextMethod;
    }

    getFirstMember() {
        return this.members[0];
    }

    toSource() {
        return "class {0} {\n{1}}\n".format(
            this.name,
            this.allToSource(this.members).join('')
        );
    }
};