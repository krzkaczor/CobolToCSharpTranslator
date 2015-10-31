var _ = require('lodash');

var cobolNodes = require('../cobol/nodes/index');
var csharpNodes = require('./../csharp/nodes/index');
var TypeRefExpr = csharpNodes.TypeReferenceExpression;
var CobolTypeRefExpr = csharpNodes.CobolTypeReferenceExpression;
var Stat = csharpNodes.Statement;
var MethodInvokeExpr = csharpNodes.MethodInvokeExpression;

var helper = require('./../csharp/transformerHelper');
var CsharpRuntime = require('./../csharp/Runtime');

require('./attachStorageTransformer');

cobolNodes.CompilationUnit.prototype.toCSharp = function () {
    var dataDivison = this.dataDivision.toCSharp();
    var procedureDivision = this.procedureDivision.toCSharp();

    var classes = _.flatten([dataDivison, procedureDivision]);

    return new csharpNodes.CompilationUnit(['System', 'System.Linq'], classes);
};

cobolNodes.DataDivision.prototype.toCSharp = function () {
    return this.workingStorageSection.toCSharp();
};


cobolNodes.ProcedureDivision.prototype.toCSharp = function () {
    var procedureClasses = helper.allToCSharp(this.sections);

    procedureClasses.forEach(cls => cls.continuousFlow = true);

    return procedureClasses;
};

cobolNodes.Section.prototype.toCSharp = function () {
    return new csharpNodes.ClassDeclaration(this.name, helper.allToCSharp(this.paragraphs)).bindWithCounterpart(this);
};

cobolNodes.Paragraph.prototype.toCSharp = function () {
    //flatten all sentences into one big array of C# statements
    var stats = _.flatten(this.sentences.map(sent => sent.statements));

    return new csharpNodes.MethodMember(this.name, helper.allToCSharp(stats), true).bindWithCounterpart(this);
};

cobolNodes.StopRunVerb.prototype.toCSharp = function () {
    return new Stat(new MethodInvokeExpr(new TypeRefExpr(CsharpRuntime.System.Environment), 'Exit', [0]));
};

cobolNodes.GoToVerb.prototype.toCSharp = function () {
    return new Stat(new MethodInvokeExpr(new CobolTypeRefExpr(this.target._parent), helper.translateMethodNameToCompanionMethodName(this.target.name)));
};

cobolNodes.PerformVerb.prototype.toCSharp = function () {
    var methodCall = new Stat(new MethodInvokeExpr(new CobolTypeRefExpr(this.target._parent), this.target.name));
    if (this.times == 1) {
        return methodCall;
    } else {
        return new csharpNodes.RawExpression(`Enumerable.Range(0, ${this.times}).ToList().ForEach(_ => ${this.target.name}());`);
    }
};

cobolNodes.DisplayVerb.prototype.toCSharp = function () {
    var printFunction = this.advancing ? 'WriteLine' : 'Write';
    return new Stat(new MethodInvokeExpr(new TypeRefExpr(CsharpRuntime.Console), printFunction, [this.what.toCSharp()]));
};

cobolNodes.StringLiteral.prototype.toCSharp = function () {
    return new csharpNodes.PrimitiveExpression(this.value);
};

cobolNodes.IntLiteral.prototype.toCSharp = function () {
    return new csharpNodes.PrimitiveExpression(this.value);
};

cobolNodes.MoveVerb.prototype.toCSharp = function () {
    return this.target.toCSharpAssignment(this.what);
};

cobolNodes.SymbolExpression.prototype.toCSharp = function () {
    return this.target.toCSharpString(); //@todo
};