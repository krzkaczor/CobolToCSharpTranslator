var Base = require('./Base');
var WhenCase = require('./WhenCase');

module.exports = class EvaluateStatement extends Base {
    constructor(type: string, whenCases: Array<WhenCase>) {
        super();
        this.lookingForTrue = type === 'TRUE';
        this.whenCases = whenCases;
    }
};