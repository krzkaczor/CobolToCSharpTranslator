var _ = require('lodash');

/**
 * Translates whole array of cobol stats to C#. Flattens output array.
 */
exports.allToCSharp = function(arr) {
    return _.flatten(arr.map(e => e.toCSharp()));
};

exports.translateDataItemName = function(name) {
    return name + "Struct";
};

exports.translateDataItemReference = function (dataItem) {
    if (!dataItem._parent) {
        return 'DataStore';
    }
    return `${exports.translateDataItemName(dataItem._parent.name)}.${dataItem.name}`;
};

exports.translateMethodNameToCompanionMethodName = function(methodName: string) {
    return methodName + 'AndContinue';
};

exports.translateCobolBooleanOperator = function(cobolOp: string) {
    switch(cobolOp) {
        case '=': return '==';
        default: return cobolOp;
    }
};