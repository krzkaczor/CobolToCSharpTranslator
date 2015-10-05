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
        var procedureDivision = this.visit(ctx.procedureDivision());

        return new nodes.CompilationUnit(identificationData, procedureDivision);
    }

    visitIdentificationDivision(ctx) {
        var id = this.visit(ctx.programId());
        return {id: id};

    }

    visitProgramId(ctx) {
        return ctx.ID().getText();
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

    visitSentence(ctx) {
        return new nodes.Sentence(this.visit(ctx.statement()));
    }

    visitStopRunStat(ctx) {
        return new nodes.StopRunVerb();
    }

    visitPerformStat(ctx) {
        return new nodes.PerformVerb(ctx.ID().getText());
    }

    visitGoToStat(ctx) {
        return new nodes.GoToVerb(ctx.ID().getText());
    }

    visitDisplayStat(ctx) {
        //should be refactored when ANTLR-JS supports this feature (i guess that i need to submit PR by myself xD)
        var label = ctx.constructor.name;

        var advancing = label === "AdvancingContext";
        var displayVerb = new nodes.DisplayVerb(this.visit(ctx.literal()), advancing);

        return displayVerb;
    }

    visitStringLiteral(ctx) {
        //toFIX - grammar should be tweeked stringLiteral: QUOTE STRING QUOTE
        var text = ctx.getText();
        return new nodes.StringLiteral(text.substr(1, text.length-2));
    }
};