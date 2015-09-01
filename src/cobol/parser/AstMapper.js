var CobolVisitor = require('./Cobol85Visitor').Cobol85Visitor;
var nodes = require('../nodes');

module.exports = class AstMapper extends CobolVisitor {
    visitCompilationUnit() {
        return new nodes.CompilationUnit("no", "elo");
    }

    visit(ctx) {
        //Get the name of the node
        var name = ctx.parser.ruleNames[ctx.ruleIndex];
        //Sharpen the name of the function VisitNode()
        var funcName = "visit" + name.charAt(0).toUpperCase() + name.slice(1);
        //Call it
        return this[funcName](ctx);
    }
};