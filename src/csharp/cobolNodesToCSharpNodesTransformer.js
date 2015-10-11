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
    //thanks to memoization we WILL get the same translated object
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