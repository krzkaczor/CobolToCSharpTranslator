var _ = require('lodash');
var MethodMember = require('./MethodMember');
var Base = require('./Base');

module.exports = class ClassDeclaration extends Base {
    constructor(name: string, members: ?Array<Base> = []) {
        super();

        if (name == 'Main') {
            name = 'MainCls';
        }

        this.name = name;
        this.members = members;
    }

    addMember(member: Base) {
        this.members.push(member);
        member._parent = this;
    }

    /**
     * Model classes have only attribute members
     * @returns {boolean}
     */
    isModelClass():boolean {
        var AttributeMember = require('./AttributeMember');
        return this.members.every(mem => mem instanceof AttributeMember);
    }

    getNextMember(member) {
        var applicableMethods = this.members.filter(mem => !mem._shadow);
        var nextMethod =  applicableMethods[_.findIndex(applicableMethods, mem => mem === member) + 1];

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
            this.allToSource(this.members).join('\n')
        );
    }
};