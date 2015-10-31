var _ = require('lodash');
var Base = require('./Base');
var Stat = require('./Statement');
var MethodInvokeExpr = require('./MethodInvokeExpression');
var TypeRefExpr = require('./TypeReferenceExpression');

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

    toSource() {
        var type = this.options.returnType? this.options.returnType.toSource() : 'void';
        var stats = this.stats.slice();

        var nextMethod = this._parent.getNextMember(this);
        if (this.isMain() && nextMethod) {
            var companion = nextMethod._companion;
            stats.push(new Stat(new MethodInvokeExpr(new TypeRefExpr(companion._parent), companion.name)));
        }

        return 'public {0} {1} {2} {3}() {\n{4}}\n'.format(
            this.options.override? 'override' : '',
            this.isStatic ? 'static ' : '',
            type,
            this.name,
            this.allToSource(stats).join('\n')
        );
    }

    bindCompanion(companion) {
        this._companion = companion;
        companion._method = this;

        return this;
    }
};