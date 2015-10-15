exports.allToCSharp = function(arr) {
    return arr.map(e => e.toCSharp());
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
