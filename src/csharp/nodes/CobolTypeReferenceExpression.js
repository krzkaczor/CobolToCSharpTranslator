var _ = require('lodash');
var Base = require('./Base');
var CobolBase = require('../../cobol/nodes/Base');
var TypeRefExpr = require('./TypeReferenceExpression');

/**
 * References CobolType in C# program. When basic structure is ready then analyze method finds proper C# structure.
 */
module.exports = class CobolTypeReferenceExpression extends Base {
    constructor(type: CobolBase){
        super();
        this._cobolType = type;
    }

    analyze() {
        this._csharpTypeRefExpr = new TypeRefExpr(this._cobolType._csharpRef);
    }

    toSource() {
        return this._csharpTypeRefExpr.toSource();
    }
};