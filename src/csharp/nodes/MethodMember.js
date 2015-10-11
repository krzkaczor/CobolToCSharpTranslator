var _ = require('lodash');
var Base = require('./Base');
var MethodInvokeExpression = require('./MethodInvokeExpression');
var assert = require('assert');

module.exports = class MethodMember extends Base {
    constructor(name: string, stats: Array<Base>, isStatic: ?boolean) {
        super();
        this.name = name;
        this.stats = stats;
        this.isStatic = isStatic || false;
    }

    isMain() {
        return this.name === 'Main';
    }

    /**
     * Works in o(n)
     */
    findCompanion() {
        var companion = this._parent.members.find(mem => mem.name == `${this.name}AndContinue`);
        if (!companion) {
            throw new Error("Couldn't found companion method");
        }
        return companion;
    }

    toSource() {
        var nextMethod = this._parent.getNextMember(this);
        if (this.isMain()) {
            return 'public {0}void {1}() {\n{2}{3}}\n'.format(
                this.isStatic ? 'static ' : '',
                this.name,
                this.allToSource(this.stats).join('\n'),
                nextMethod?new MethodInvokeExpression(nextMethod.findCompanion()).toSource() :''
            );
        } else {
            return 'public {0}void {1}() {\n{2}}\n'.format(
                this.isStatic ? 'static ' : '',
                this.name,
                this.allToSource(this.stats).join('\n')
            );
        }
    }
};