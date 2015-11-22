var CobolTypes = require('../cobol/CobolTypes');
var RawExpression = require('../csharp/nodes/RawExpression');
var IfStatement = require('../csharp/nodes/IfStatement');
var BinaryOperatorCall = require('../csharp/nodes/BinaryOperatorCall');
var PrimitiveExpr = require('../csharp/nodes/PrimitiveExpression');
var ReturnStat = require('../csharp/nodes/ReturnStatement');
var VariableRefExpr = require('../csharp/nodes/VariableReferenceExpression');
var AssignStat = require('../csharp/nodes/AssignStatement');
var MethodInvokeExpr = require('../csharp/nodes/MethodInvokeExpression');
var TypeRefExpr = require('../csharp/nodes/TypeReferenceExpression');
var csRuntime = require('../csharp/Runtime');

CobolTypes.Alphabetic.prototype.toCSharpType = function () {
    return 'string';
};

CobolTypes.Alphanumeric.prototype.toCSharpType = function () {
    return 'string';
};

CobolTypes.Numeric.prototype.toCSharpType = function () {
    return 'int';
};

CobolTypes.Alphabetic.prototype.toCobolString = CobolTypes.Alphanumeric.prototype.toCobolString = function(name, size) {
    return new RawExpression(`${name}.ToCobolString(${size})`)
};

CobolTypes.Numeric.prototype.toCobolString = function(name, size) {
    return new RawExpression(`${name}.ToCobolString(${size}, ${this.signed})`)
};

CobolTypes.Numeric.prototype.generateSetterGuard = function(size) {
    let valueRef = new VariableRefExpr('value');
    return new IfStatement(new BinaryOperatorCall('>',  new MethodInvokeExpr(new TypeRefExpr(csRuntime.Math), 'Abs', [valueRef]), new PrimitiveExpr(parseInt('9'.repeat(size)))), new ReturnStat());
};

CobolTypes.Numeric.prototype.generateSetterTransformation = function(ref) {
    if (!this.signed) {
        return new AssignStat(ref, new MethodInvokeExpr(new TypeRefExpr(csRuntime.Math), 'Abs', [ref]));
    }
};