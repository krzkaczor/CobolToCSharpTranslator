var _ = require('lodash');
var Base = require('./Base');

module.exports = class ThisReferenceExpression extends Base {
    toSource() {
        return 'this';
    }
};