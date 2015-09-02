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

    return new csharpNodes.MethodMember('Main', allToCSharp(stats), true);
};

cobolNodes.DisplayVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression('Console', 'WriteLine', [this.what.toCSharp()]);
};

cobolNodes.StringLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('"{0}"'.format(this.value));
};