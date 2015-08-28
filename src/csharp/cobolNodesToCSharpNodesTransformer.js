var cobolNodes = require('../cobol/nodes');
var csharpNodes = require('./nodes');

cobolNodes.CompilationUnit.prototype.toCSharp = function () {
    return new csharpNodes.CompilationUnit(['System'], [this.procedureDivision.toCSharp()]);
};

cobolNodes.ProcedureDivision.prototype.toCSharp = function () {
    var MainMethod = this.paragraphs[0].toCSharp(true);
    return new csharpNodes.ClassDeclaration('Runner', [MainMethod]);
};

cobolNodes.Paragraph.prototype.toCSharp = function (asMain) {
    if (asMain) {
        return new csharpNodes.MethodMember('Main', this.statements.map(stat => stat.toCSharp(true)), true);
    } else {
        assert(false);
    }
};

cobolNodes.DisplayVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression('Console', 'WriteLine', [this.what.toCSharp()]);
};

cobolNodes.StringLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('"{0}"'.format(this.value));
};