var _ = require('lodash');

var cobolNodes = require('../cobol/nodes/index');
var csharpNodes = require('./../csharp/nodes/index');
var helper = require('./../csharp/transformerHelper');
var CsharpRuntime = require('./../csharp/Runtime');

require('./WorkingStorageSection');

cobolNodes.CompilationUnit.prototype.toCSharp = function () {
    var dataDivison = this.dataDivision.toCSharp();
    var procedureDivision = this.procedureDivision.toCSharp();

    var classes = _.flatten([dataDivison, procedureDivision]);

    return new csharpNodes.CompilationUnit(['System'], classes);
};

cobolNodes.DataDivision.prototype.toCSharp = function() {
    return this.workingStorageSection.toCSharp();
};


cobolNodes.ProcedureDivision.prototype.toCSharp = function () {
    var procedureClasses =  helper.allToCSharp(this.sections);

    procedureClasses.forEach(cls => cls.continuousFlow = true);

    return procedureClasses;
};

cobolNodes.Section.prototype.toCSharp = function() {
    return new csharpNodes.ClassDeclaration(this.name, helper.allToCSharp(this.paragraphs));
};

cobolNodes.Paragraph.prototype.toCSharp = function () {
    //flatten all sentences into one big array of C# statements
    var stats = _.flatten(this.sentences.map(sent => sent.statements));

    return new csharpNodes.MethodMember(this.name, helper.allToCSharp(stats), true);
};

cobolNodes.StopRunVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression(CsharpRuntime['System.Environment.Exit'], ['0']);
};

cobolNodes.GoToVerb.prototype.toCSharp = function() {
    //thanks to memoization we WILL get the same translated object
    return new csharpNodes.MethodInvokeExpression(new csharpNodes.RawExpression(helper.translateMethodNameToCompanionMethodName(this.target.name)));
};

cobolNodes.PerformVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression(this.target.toCSharp()); //thanks to memoization we WILL get the same translated object
};

cobolNodes.DisplayVerb.prototype.toCSharp = function() {
    var printFunction = this.advancing? CsharpRuntime['Console.WriteLine'] : CsharpRuntime['Console.Write'];
    return new csharpNodes.MethodInvokeExpression(printFunction, [this.what.toCSharp()]);
};

cobolNodes.StringLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('"{0}"'.format(this.value));
};

cobolNodes.IntLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('{0}'.format(this.value));
};

cobolNodes.MoveVerb.prototype.toCSharp = function() {
    return new csharpNodes.AssignmentOperator(this.target.csharpRef, this.what.toCSharp());
};

cobolNodes.SymbolExpression.prototype.toCSharp = function() {
    return this.target.csharpRef;
};