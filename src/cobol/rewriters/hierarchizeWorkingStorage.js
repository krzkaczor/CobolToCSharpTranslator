var _ = require('lodash');

var nodes = require('../nodes');
var SymbolTable = nodes.SymbolTable;
var CompilationUnit = nodes.CompilationUnit;

var GroupItem = function(lvl, v) {
    this.level = lvl;
    this.value = v;
    this.children = [];
};
GroupItem.prototype.addDataItem= function(child) {
    this.children.push(child);
};

/**
 * Due to parser limits we can't create hierarchy of data items immediately.
 * This rewriter is suppose to do this and create globalScope object
 * @param compilationUnit
 */
module.exports = function(compilationUnit) {
    var workingStorageSection = compilationUnit.dataDivision.workingStorageSection;

    //create workingStorage
    //todo: export to new rewritter
    compilationUnit._globalScope = new SymbolTable();
    workingStorageSection.variables.forEach(variables => compilationUnit._globalScope.set(variables.name, variables));

    var dataItems = workingStorageSection.variables.slice();

    function hierarchize(parent) {
        var head;
        while(_.head(dataItems) && _.head(dataItems).level > parent.level) {
            head = dataItems.shift();
            parent.children.push(head);
            hierarchize(head);
        }
    }
    var root = new GroupItem(0, 'ROOT');

    hierarchize(root);

    compilationUnit.dataDivision.workingStorageSection = root.children;

    return compilationUnit;
};