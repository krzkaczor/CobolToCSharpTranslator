var _ = require('lodash');
var Base = require('./Base');
var MethodInvokeExpression = require('./MethodInvokeExpression');

module.exports = class MethodMember extends Base {
    constructor(name: string, stats: Array<Base>, isStatic: ?boolean = false, options: ?Object = {}) {
        super();
        this.name = name;
        this.stats = stats;
        this.isStatic = isStatic;
        this.options = options;
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
        var type = this.options.returnType? this.options.returnType.toSource() : 'void';
        if (this.isMain()) {
            return 'public {0} {1} {2}() {\n{3}{4}}\n'.format(
                this.isStatic ? 'static ' : '',
                type,
                this.name,
                this.allToSource(this.stats).join('\n'),
                nextMethod?new MethodInvokeExpression(nextMethod.findCompanion()).toSource() :''
            );
        } else {
            return 'public {0} {1} {2} {3}() {\n{4}}\n'.format(
                this.options.override? 'override' : '',
                this.isStatic ? 'static ' : '',
                type,
                this.name,
                this.allToSource(this.stats).join('\n')
            );
        }
    }
};