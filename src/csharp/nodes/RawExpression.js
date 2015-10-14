var _ = require('lodash');
var Base = require('./Base');

/**
 * Escape hatch from csharp typesystem
 * @type {RawExpression}
 */
module.exports = class RawExpression extends Base {
    constructor(rawExpression: string) {
        super();
        this.rawExpression = rawExpression;
    }

    toSource() {
        return this.rawExpression;
    }
};