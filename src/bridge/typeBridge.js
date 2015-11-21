var CobolTypes = require('../cobol/CobolTypes');

CobolTypes.Alphabetic.prototype.toCSharpType = function () {
    return 'string';
};

CobolTypes.Alphanumeric.prototype.toCSharpType = function () {
    return 'string';
};

CobolTypes.Numeric.prototype.toCSharpType = function () {
    return 'int';
};