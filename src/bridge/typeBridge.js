var CobolTypes = require('../cobol/CobolTypes');
var RawExpression = require('../csharp/nodes/RawExpression');

CobolTypes.Alphabetic.prototype.toCSharpType = function () {
    return 'string';
};

CobolTypes.Alphabetic.prototype.toCobolString = CobolTypes.Alphanumeric.prototype.toCobolString = function(name, size) {
    return new RawExpression(`${name}.ToCobolString(${size})`)
};

CobolTypes.Alphanumeric.prototype.toCSharpType = function () {
    return 'string';
};

CobolTypes.Numeric.prototype.toCSharpType = function () {
    return 'int';
};

CobolTypes.Numeric.prototype.toCobolString = function(name, size) {
    return new RawExpression(`${name}.ToCobolString(${size}, ${this.signed})`)
};