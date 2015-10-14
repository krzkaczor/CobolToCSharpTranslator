exports.allToCSharp = function(arr) {
    return arr.map(e => e.toCSharp());
};

exports.translateDataItemName = function(name) {
    return name + "Struct";
};

exports.translateDataItemName = function (dataItem) {
    if (!dataItem._parent) {
        return 'DataStore';
    }
    return `${exports.translateDataItemName(dataItem._parent)}.${dataItem.name}`;
};

exports.translateMethodNameToCompanionMethodName = function(methodName: string) {
    return methodName + 'AndContinue';
}
