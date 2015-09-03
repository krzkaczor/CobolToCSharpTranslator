var Base = require('./Base');
var MethodInvokeExpression = require('./MethodInvokeExpression');

module.exports = class MethodMember extends Base {
    constructor(name, stats, isStatic) {
        super();
        this.name = name;
        this.stats = stats;
        this.isStatic = isStatic || false;
    }

    isMain() {
        return this.name === 'Main';
    }

    toSource() {
        var nextMethod = this._parent.getNextMember(this);
        if (this.isMain()) {
            return 'public {0}void {1}() {\n{2}{3}}\n'.format(
                this.isStatic ? 'static ' : '',
                this.name,
                this.allToSource(this.stats).join('\n'),
                nextMethod?new MethodInvokeExpression(nextMethod, ['true']).toSource() :''
            );
        } else if (nextMethod === undefined) {
            return 'public {0}void {1}(bool fallThrough) {\n{2}}\n'.format(
                this.isStatic ? 'static ' : '',
                this.name,
                this.allToSource(this.stats).join('\n')
            );
        } else {
            return 'public {0}void {1}(bool fallThrough) {\n{2} if(fallThrough) {3}}\n'.format(
                this.isStatic ? 'static ' : '',
                this.name,
                this.allToSource(this.stats).join('\n'),
                new MethodInvokeExpression(nextMethod, ['true']).toSource()
            );
        }
    }
};