var _ = require('lodash');
var CobolVisitor = require('./Cobol85Visitor').Cobol85Visitor;
var nodes = require('../nodes');


var autoVisitor = function(visitor) {
    _.chain(visitor.prototype).pairs().filter((keyAndValue) => {
        return _.startsWith(keyAndValue[0], 'visit') && keyAndValue[0] != 'visit' ;
    }).forEach(keyAndValue => {
        var [key, value] = keyAndValue;

        visitor.prototype[key] = function(ctx) {
            return this.visit(ctx.children[0]);
        }
    }).run();
};

autoVisitor(CobolVisitor);
module.exports = class AstMapper extends CobolVisitor {
    visitCompilationUnit(ctx) {
        var identificationData = this.visit(ctx.identificationDivision());
        var dataDivision = ctx.dataDivision()? this.visit(ctx.dataDivision()) : new nodes.DataDivision();
        var procedureDivision = this.visit(ctx.procedureDivision());

        return new nodes.CompilationUnit(identificationData, dataDivision, procedureDivision);
    }

    visitIdentificationDivision(ctx) {
        var id = this.visit(ctx.programId());
        return {id: id};

    }

    visitProgramId(ctx) {
        return ctx.ID().getText();
    }

    visitDataDivision(ctx) {
        return new nodes.DataDivision(this.visit(ctx.workingStorageSection()));
    }

    visitWorkingStorageSection(ctx) {
        return new nodes.WorkingStorageSection(this.visit(ctx.variableDeclaration()));
    }

    visitZeroInit(ctx) {
        return new nodes.IntLiteral(0);
    }

    visitLiteralInit(ctx) {
        return this.visit(ctx.literal());
    }

    visitLiteralList(ctx) {
        return this.visit(ctx.literal());
    }

    visitConditionalNameDecl(ctx) {
        return new nodes.ConditionalNameItem(ctx.ID().getText(), this.visit(ctx.literalList()));
    }

    visitConditionalNameThruDecl(ctx) {
        return new nodes.ConditionalNameItem(ctx.ID().getText(), this.visit(ctx.literal()), true);
    }

    visitEvaluateStat(ctx) {
        return new nodes.EvaluateStatement(ctx.children[1].getText(), this.visit(ctx.whenCase()));
    }

    visitWhenCase(ctx) {
        return new nodes.WhenCase(this.visit(ctx.booleanExpression()), this.visit(ctx.statement()));
    }

    visitElementaryVariableDecl(ctx) {
        return new nodes.ElementaryItem(parseInt(ctx.NUMBER().getText()), ctx.ID().getText(), this.visit(ctx.picture()), ctx.initializer()?this.visit(ctx.initializer()):undefined);
    }

    visitVerbosePicture(ctx) {
        var type = ctx.children[1].getText();
        var times = type.length;

        if (type[0] === 'X')
            return new nodes.Picture('string', times);
        else
            return new nodes.Picture('int', times);
    }

    visitNumberPicture(ctx) {
        var type = ctx.children[1].getText();
        var times = parseInt(ctx.children[3].getText());

        if (type[0] === 'X')
            return new nodes.Picture('string', times);
        else
            return new nodes.Picture('int', times);
    }

    visitGroupVariableDecl(ctx) {
        return new nodes.GroupItem(parseInt(ctx.NUMBER().getText()), ctx.ID().getText());
    }

    visitProcedureDivision(ctx) {
        var freeSentences = this.visit(ctx.sentence());
        var freeParagraphs = this.visit(ctx.paragraph());
        var sections = this.visit(ctx.section());

        return new nodes.ProcedureDivision(freeSentences, freeParagraphs, sections);
    }

    visitSection(ctx) {
        var name = ctx.ID().getText();
        var freeSentences = this.visit(ctx.sentence());
        var paragraphs = this.visit(ctx.paragraph());

        return new nodes.Section(name, freeSentences, paragraphs);
    }

    visitParagraph(ctx) {
        var name = ctx.ID().getText();
        var sentences = this.visit(ctx.sentence());

        return new nodes.Paragraph(name, sentences);
    }

    visitSymbolExpr(ctx) {
        return new nodes.SymbolExpression(ctx.ID().getText());
    }

    visitSentence(ctx) {
        return new nodes.Sentence(this.visit(ctx.statement()));
    }

    visitStopRunStat(ctx) {
        return new nodes.StopRunVerb();
    }

    visitAcceptStat(ctx) {
        return new nodes.AcceptVerb(ctx.ID().getText());
    }

    visitAddToStat(ctx) {
        var targetName = ctx.ID().getText();
        return new nodes.AddVerb(targetName, [new nodes.SymbolExpression(targetName), this.visit(ctx.varOrNumber())] );
    }

    visitAddGivingStat(ctx) {
        return new nodes.AddVerb(ctx.ID().getText(), this.visit(ctx.varOrNumber()));
    }

    visitSubtractToStat(ctx) {
        var targetName = ctx.ID().getText();
        return new nodes.SubtractVerb(targetName, new nodes.SymbolExpression(targetName), this.visit(ctx.varOrNumber()));
    }

    visitSubtractGivingStat(ctx) {
        var components = this.visit(ctx.varOrNumber());
        var reversedComponents = components.reverse();
        return new nodes.SubtractVerb(ctx.ID().getText(), _.head(reversedComponents), (_.tail(reversedComponents)).reverse());
    }

    visitMultiplyByStat(ctx) {
        var targetName = ctx.ID().getText();
        return new nodes.MultiplyVerb(targetName, [new nodes.SymbolExpression(targetName), this.visit(ctx.varOrNumber())]);
    }

    visitMultiplyByGivingStat(ctx) {
        var targetName = ctx.ID().getText();
        return new nodes.MultiplyVerb(targetName, this.visit(ctx.varOrNumber()));
    }

    visitDivideIntoStat(ctx) {
        var targetName = ctx.ID().getText();
        return new nodes.DivideVerb(targetName, [new nodes.SymbolExpression(targetName), this.visit(ctx.varOrNumber())]);
    }

    visitDivideByGivingStat(ctx) {
        var targetName = ctx.ID()[0].getText();
        var remainderName = ctx.ID()[1].getText();

        return new nodes.DivideVerb(targetName, this.visit(ctx.varOrNumber()), remainderName);
    }

    visitPerformSingleStat(ctx) {
        return new nodes.PerformVerb(ctx.ID().getText());
    }

    visitPerformTimesStat(ctx) {
        return new nodes.PerformVerb(ctx.ID().getText(), parseInt(ctx.NUMBER().getText()));
    }

    visitGoToStat(ctx) {
        return new nodes.GoToVerb(ctx.ID().getText());
    }

    visitMoveStat(ctx) {
        return new nodes.MoveVerb(ctx.ID().getText(), this.visit(ctx.literal()));
    }

    visitAdvancingDisplayStat(ctx) {
        return new nodes.DisplayVerb(this.visit(ctx.expr()), true);
    }

    visitNoAdvancingDisplayStat(ctx) {
        return new nodes.DisplayVerb(this.visit(ctx.expr()), false);
    }

    visitVariableRef(ctx) {
        return new nodes.SymbolExpression(ctx.ID().getText());
    }

    visitPerformUntilStat(ctx) {
        return new nodes.PerformUntilVerb(this.visit(ctx.booleanExpression()), this.visit(ctx.statement()));
    }

    visitSymbolBoolExpr(ctx) {
        return new nodes.SymbolExpression(ctx.ID().getText());
    }

    visitIfThenStat(ctx) {
        return new nodes.IfStatement(this.visit(ctx.booleanExpression()), this.visit(ctx.sentence()).statements);
    }

    visitIfThenEndIfStat(ctx) {
        return new nodes.IfStatement(this.visit(ctx.booleanExpression()), this.visit(ctx.statement()));
    }

    visitIfElseStat(ctx) {
        return new nodes.IfStatement(this.visit(ctx.booleanExpression()), this.visit(ctx.statement()), this.visit(ctx.statement2().map(s=>s.children[0])));
    }


    visitOperatorBoolExpr(ctx) {
        return new nodes.BooleanOperatorCall(ctx.children[1].getText(), ...this.visit(ctx.booleanExpression()));
    }

    visitStringLiteral(ctx) {
        //toFIX - grammar should be tweeked stringLiteral: QUOTE STRING QUOTE
        var text = ctx.getText();
        return new nodes.StringLiteral(text.substr(1, text.length-2));
    }

    visitNumericLiteral(ctx) {
        return new nodes.IntLiteral(parseInt(ctx.getText()));
    }
};