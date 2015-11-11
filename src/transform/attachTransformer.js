var _ = require('lodash');

var cobolNodes = require('../cobol/nodes/index');
var csNodes = require('./../csharp/nodes/index');
var TypeRefExpr = csNodes.TypeReferenceExpression;
var CobolTypeRefExpr = csNodes.CobolTypeReferenceExpression;
var Stat = csNodes.Statement;
var MethodInvokeExpr = csNodes.MethodInvokeExpression;
var AssignStat = csNodes.AssignStatement;
var PrimitiveExpr = csNodes.PrimitiveExpression;

var helper = require('./../csharp/transformerHelper');
var CsharpRuntime = require('./../csharp/Runtime');

require('./attachStorageTransformer');

cobolNodes.CompilationUnit.prototype.toCSharp = function () {
    var dataDivison = this.dataDivision.toCSharp();
    var procedureDivision = this.procedureDivision.toCSharp();

    var classes = _.flatten([dataDivison, procedureDivision]);

    return new csNodes.CompilationUnit(['System', 'System.Linq'], classes);
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
    return new csNodes.ClassDeclaration(this.name, helper.allToCSharp(this.paragraphs)).bindWithCounterpart(this);
};

cobolNodes.Paragraph.prototype.toCSharp = function () {
    //flatten all sentences into one big array of C# statements
    var stats = _.flatten(this.sentences.map(sent => sent.statements));

    return new csNodes.MethodMember(this.name, helper.allToCSharp(stats), true).bindWithCounterpart(this);
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
        return new csNodes.RawExpression(`Enumerable.Range(0, ${this.times}).ToList().ForEach(_ => ${this.target.name}());`);
    }
};

cobolNodes.DisplayVerb.prototype.toCSharp = function () {
    var printFunction = this.advancing ? 'WriteLine' : 'Write';
    return new Stat(new MethodInvokeExpr(new TypeRefExpr(CsharpRuntime.Console), printFunction, [
        this.what
            .map(w => w instanceof cobolNodes.SymbolExpression? w.toCSharpString() : w.toCSharp())
            .reduce((a, c) => new csNodes.BinaryOperatorCall('+', a, c))
    ]));
};

cobolNodes.StringLiteral.prototype.toCSharp = function () {
    return new csNodes.PrimitiveExpression(this.value);
};

cobolNodes.IntLiteral.prototype.toCSharp = function () {
    return new csNodes.PrimitiveExpression(this.value);
};

cobolNodes.MoveVerb.prototype.toCSharp = function () {
    return this.target.toCSharpAssignment(this.what);
};

cobolNodes.AcceptVerb.prototype.toCSharp = function () {
    return this.target.toCSharpKeyboardLoader();
};

cobolNodes.SymbolExpression.prototype.toCSharp = function () {
    return this.target._csharpRef;
};

cobolNodes.SymbolExpression.prototype.toCSharpString = function () {
    return this.target.toCSharpString();
};

function createStatementForArithmeticExpression(operator: string, shortcut: ?csNodes.Base) {
    var targets = this.components.filter(comp => comp instanceof cobolNodes.Base).map(comp => comp.target);

    if (targets.includes(this.target)) {
        let components = helper.allToCSharp(this.components.filter(comp => comp.target != this.target));
        if (shortcut && components.length == 1 && components[0].primitive === 1) {
            return new Stat(new shortcut(this.target._csharpRef));
        }

        let componentsExpression = components.reduce((a, c) => new csNodes.BinaryOperatorCall(operator, a, c));

        return new AssignStat(this.target._csharpRef, componentsExpression, operator);
    } else {
        let components = helper.allToCSharp(this.components);
        let componentsExpression = components.reduce((a, c) => new csNodes.BinaryOperatorCall(operator, a, c));

        return new AssignStat(this.target._csharpRef, componentsExpression);
    }
}

cobolNodes.AddVerb.prototype.toCSharp = function() {
    return createStatementForArithmeticExpression.call(this, '+', csNodes.IncrementExpression);
};

cobolNodes.MultiplyVerb.prototype.toCSharp = function() {
    return createStatementForArithmeticExpression.call(this, '*');
};

cobolNodes.PerformUntilVerb.prototype.toCSharp = function() {
    return new csNodes.WhileStatement(new csNodes.UnaryOperatorCall('!', this.condition.toCSharp()), new csNodes.Block(helper.allToCSharp(this.stats)));
};

cobolNodes.BooleanOperatorCall.prototype.toCSharp = function() {
    return new csNodes.BinaryOperatorCall(helper.translateCobolBooleanOperator(this.operator), this.left.toCSharp(), this.right.toCSharp());
};

cobolNodes.IfStatement.prototype.toCSharp = function() {
    return new csNodes.IfStatement(this.condition.toCSharp(), new csNodes.Block(helper.allToCSharp(this.trueStatements)), this.falseStatements? new csNodes.Block(helper.allToCSharp(this.falseStatements)) : undefined);
};

cobolNodes.EvaluateStatement.prototype.toCSharp = function() {
    return this.whenCases.reduceRight((acc, caze) => {
        return new csNodes.IfStatement(this.lookingForTrue?caze.condition.toCSharp():new csNodes.UnaryOperatorCall('!', caze.condition.toCSharp()), new csNodes.Block(helper.allToCSharp(caze.statements)), acc);
    }, undefined);
};