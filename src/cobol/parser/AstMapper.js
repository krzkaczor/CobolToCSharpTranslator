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

    visitElementaryVariableDecl(ctx) {
        return new nodes.ElementaryItem(parseInt(ctx.NUMBER().getText()), ctx.ID().getText(), this.visit(ctx.picture()));
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
        return new nodes.AddVerb(ctx.ID().getText(), parseInt(ctx.NUMBER().getText()));
    }

    visitAddGivingStat(ctx) {
        var ids = ctx.ID().map(id => id.getText()).reverse();
        return new nodes.AddVerb(_.head(ids), _.tail(ids).reverse());
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

    visitStringLiteral(ctx) {
        //toFIX - grammar should be tweeked stringLiteral: QUOTE STRING QUOTE
        var text = ctx.getText();
        return new nodes.StringLiteral(text.substr(1, text.length-2));
    }

    visitNumericLiteral(ctx) {
        return new nodes.IntLiteral(parseInt(ctx.getText()));
    }
};