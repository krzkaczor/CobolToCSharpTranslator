var cobolNodes = require('../cobol/nodes');
var csharpNodes = require('./nodes');

csharpNodes.CompilationUnit.prototype.toCSharp = function () {
    return new csharpNodes.CompilationUnit(['System'], this.procedureDivision.toCSharp());
};

csharpNodes.ProcedureDivision.prototype.toCSharp = function () {
    var MainMethod = new csharpNodes.MethodMember('main', true, this.paragraphs[0].toCSharp(true));
    return new csharpNodes.ClassDeclaration('Main class', [MainMethod]);
};

csharpNodes.Paragraph.prototype.toCSharp = function (asMain) {
    if (asMain) {
        return new csharpNodes.MethodMember('main', true, this.statements.map.toCSharp(true));
    } else {
        assert(false);
    }
};

csharpNodes.DisplayVerb.prototype.toCSharp = function() {
    return new MethodInvokeExpression('Console', 'WriteLine', [this.what.toCSharp()]);
};

csharpNodes.StringLiteral.prototype.toCSharp = function() {
    return new PrimitiveExpression('"{0}"'.format(this.value));
};