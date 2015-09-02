require('./utils');

var fs = require('fs');
var path = require('path');
var csharpTransformer = require('./csharp/cobolNodesToCSharpNodesTransformer');

//const PARSER_PATH = path.join(__dirname, 'cobol/grammar');

var antlr4 = require('antlr4');
var Cobol85Lexer = require('./cobol/parser/Cobol85Lexer').Cobol85Lexer;
var Cobol85Parser = require('./cobol/parser/Cobol85Parser').Cobol85Parser;
var Cobol85Visitor = require('./cobol/parser/Cobol85Visitor').Cobol85Visitor;
var visitorWrapper = require('./cobol/parser/VisitorWrapper');

var CobolAstMapper = require('./cobol/parser/AstMapper');

module.exports = class CobolToCSharpTranslator {
    constructor() {
    }

    getCobolAst(input) {
        var chars = new antlr4.InputStream(input);
        var lexer = new Cobol85Lexer(chars);
        var tokens  = new antlr4.CommonTokenStream(lexer);
        var parser = new Cobol85Parser(tokens);
        parser.buildParseTrees = true;
        var tree = parser.compilationUnit();

        var cobolAstMapper = new CobolAstMapper();
        var astCobol = cobolAstMapper.visit(tree);

        //complete AST
        astCobol.bindWithParent();
        astCobol.act('analyze');

        return astCobol;
    }

    getCobolAstAndRewrite(input) {
        var ast = this.getCobolAst(input);

        var rewrites = [
            require('./cobol/rewriters/createRunnerSection').bind(undefined, 'Runner'),
            require('./cobol/rewriters/moveFreeStatementsToParagraph').bind(undefined, 'main'),
        ];

        var rewrittenAst = rewrites.reduce((ast, rewriter) => rewriter(ast), ast);

        return rewrittenAst;
    }

    getCSharpAst(input) {
        return this.getCobolAstAndRewrite(input).toCSharp();
    }

    getCSharpCode(input) {
        return this.getCSharpAst(input).toSource();
    }
};