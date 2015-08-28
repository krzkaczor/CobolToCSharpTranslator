var Base = require('./Base');

module.exports = class MethodMember extends Base {
    constructor(name, stats, isStatic) {
        super();
        this.name = name;
        this.stats = stats;
        this.isStatic = isStatic || false;
    }

    toSource() {
        return '{0}void {1}() {\n{2}}\n'.format(this.isStatic? 'static ': '', this.name, this.stats.map(s=>s.toSource()).reduce((a,b) => b  + '\n' + a, ""));
    }
};