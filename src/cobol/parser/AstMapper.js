var _ = require('lodash');
var CobolVisitor = require('./Cobol85Visitor').Cobol85Visitor;
var nodes = require('../nodes');


var autoVisitor = function(visitor) {
    _.chain(visitor.prototype).pairs().filter((keyAndValue) => {
        return _.startsWith(keyAndValue[0], 'visit');
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
        var sections = this.visit(ctx.sections());
        return new nodes.ProcedureDivision(freeSentences);
    }

    visitSentence(ctx) {
        debugger;
        return new nodes.Sentence(this.visit(ctx.statement()));
    }

    visitDisplayStat(ctx) {
        return new nodes.DisplayVerb(this.visit(ctx.literal()));
    }

    visitStringLiteral(ctx) {
        //toFIX - grammar should be tweeked stringLiteral: QUOTE STRING QUOTE
        var text = ctx.getText();
        return new nodes.StringLiteral(text.substr(1, text.length-2));
    }

    visit(ctx) {
        if (_.isArray(ctx)) {
            var children = ctx;

            return children.map(child => this.visitAtom(child));
        } else {
            return this.visitAtom(ctx);
        }
    }

    visitAtom(ctx) {
        if (_.isUndefined(ctx.parser)) { //its terminal TODO:better condition
            return;
        }

        //Get the name of the node
        var name = ctx.parser.ruleNames[ctx.ruleIndex];
        //Sharpen the name of the function VisitNode()
        var funcName = "visit" + name.charAt(0).toUpperCase() + name.slice(1);
        //Call it
        return this[funcName](ctx);
    }
};