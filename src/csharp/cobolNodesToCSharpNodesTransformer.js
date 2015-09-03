var _ = require('lodash');

var cobolNodes = require('../cobol/nodes');
var csharpNodes = require('./nodes');

var allToCSharp = function(arr) {
    return arr.map(e => e.toCSharp());
};

cobolNodes.CompilationUnit.prototype.toCSharp = function () {
    return new csharpNodes.CompilationUnit(['System'], this.procedureDivision.toCSharp());
};

cobolNodes.ProcedureDivision.prototype.toCSharp = function () {
    return allToCSharp(this.sections);
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
    return new csharpNodes.MethodInvokeExpression(this.target.toCSharp(), ['true']); //thanks to memoization we WILL get the same translated object
};

cobolNodes.PerformVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression(this.target.toCSharp(), ['false']); //thanks to memoization we WILL get the same translated object
};

cobolNodes.DisplayVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression('Console.WriteLine', [this.what.toCSharp()]);
};

cobolNodes.StringLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('"{0}"'.format(this.value));
};