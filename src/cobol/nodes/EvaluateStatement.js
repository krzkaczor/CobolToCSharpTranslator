var Base = require('./Base');
var WhenCase = require('./WhenCase');

module.exports = class EvaluateStatement extends Base {
    constructor(whenCases: Array<WhenCase>) {
        super();
        this.whenCases = whenCases;
    }
};