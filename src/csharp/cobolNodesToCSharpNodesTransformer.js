var _ = require('lodash');

var cobolNodes = require('../cobol/nodes');
var csharpNodes = require('./nodes');

console.log("DEBUG=============");  
console.log(cobolNodes);

//helpers
var allToCSharp = function(arr) {
    return arr.map(e => e.toCSharp());
};

function translateDataItemName(name) {
    return name + "Struct";
}

//runtime
const CSHARP_RUNTIME = {
    int : new csharpNodes.ClassDeclaration('int'),
    string  : new csharpNodes.ClassDeclaration('string')
};


cobolNodes.CompilationUnit.prototype.toCSharp = function () {
    var dataDivison = this.dataDivision.toCSharp();
    var procedureDivision = this.procedureDivision.toCSharp();

    var classes = _.flatten([dataDivison, procedureDivision]);

    return new csharpNodes.CompilationUnit(['System'], classes);
};

cobolNodes.DataDivision.prototype.toCSharp = function() {
    return this.workingStorageSection.toCSharp();
};

cobolNodes.WorkingStorageSection.prototype.toCSharp = function() {
    function translateChildren(correspondingClass: csharpNodes.ClassDeclaration, children: Array) {
        children.forEach(child => {
            if (child instanceof cobolNodes.GroupItem) {
                correspondingClass.addMember(new csharpNodes.AttributeMember(child.name, classes[translateDataItemName(child.name)], true));
            } else {
                correspondingClass.addMember(new csharpNodes.AttributeMember(child.name, CSHARP_RUNTIME[child.picture], true));
            }
        });
    }

    //creating schema
    var globalScope = this.parent.parent._globalScope;
    var groupItems = _.values(globalScope.data).filter(g => g instanceof cobolNodes.GroupItem);

    var classes = _.chain(groupItems)
        .map(group => new csharpNodes.ClassDeclaration(translateDataItemName(group.name)))
        .indexBy('name')
        .run();

    groupItems.forEach(group => {
        var correspondingClass = classes[translateDataItemName(group.name)];

        translateChildren(correspondingClass, group.children);
    });

    var dataStore = new csharpNodes.ClassDeclaration('DataStore');
    translateChildren(dataStore, this.variables);


    return _.flatten([_.values(classes), dataStore]);
};

cobolNodes.ProcedureDivision.prototype.toCSharp = function () {
    var procedureClasses =  allToCSharp(this.sections);

    procedureClasses.forEach(cls => cls.continuousFlow = true);

    return procedureClasses;
};

cobolNodes.Section.prototype.toCSharp = function() {
    return new csharpNodes.ClassDeclaration(this.name, allToCSharp(this.paragraphs));
};

cobolNodes.Paragraph.prototype.toCSharp = function () {
    //flatten all sentences into one big array of C# statements
    var stats = _.flatten(this.sentences.map(sent => sent.statements));

    return new csharpNodes.MethodMember(this.name, allToCSharp(stats), true);
};

cobolNodes.StopRunVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression('System.Environment.Exit', ['0']);
};

cobolNodes.GoToVerb.prototype.toCSharp = function() {
    //thanks to memoization we WILL get the same translated object
    debugger;
    var invokeExpr = new csharpNodes.MethodInvokeExpression(this.target.toCSharp());
    invokeExpr.goTo = true;
    return invokeExpr;
};

cobolNodes.PerformVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression(this.target.toCSharp()); //thanks to memoization we WILL get the same translated object
};

cobolNodes.DisplayVerb.prototype.toCSharp = function() {
    var printFunction = this.advancing? 'Console.WriteLine' : 'Console.Write';
    return new csharpNodes.MethodInvokeExpression(printFunction, [this.what.toCSharp()]);
};

cobolNodes.StringLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('"{0}"'.format(this.value));
};

cobolNodes.IntLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('{0}'.format(this.value));
};

cobolNodes.MoveVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression(this.where+".load", [this.what.toCSharp()]);
};

cobolNodes.SymbolExpression.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression(this.what);
};