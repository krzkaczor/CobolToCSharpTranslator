require('babel-core/polyfill');
require('./polyfills');

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

function loadPreprocessor(name) {
    return require(`./cobol/preprocessors/${name}`);
}

function loadCobolRewritter(name) {
    return require(`./cobol/rewriters/${name}`);
}

function loadCSharpRewritter(name) {
    return require(`./csharp/rewriters/${name}`);
}

module.exports = class CobolToCSharpTranslator {
    constructor() {
        this.preprocessors = [loadPreprocessor('removeMicrofocusDirectives')];

        this.cobolRewritters = [
            loadCobolRewritter('createRunnerSection').bind(undefined, 'Runner'),
            loadCobolRewritter('moveFreeStatementsToParagraph').bind(undefined, 'main'),
            loadCobolRewritter('hierarchizeWorkingStorage')
        ];

        this.cSharpRewritters = [
            loadCSharpRewritter('createCompanionMethods')
        ];

        this.postprocessor = []; //TODO: inject here postprocessor to deal with code formating of csharp code
    }

    preprocessInput(input) {
        return this.preprocessors.reduce((input, preprocessor) => preprocessor(input), input);
    }

    getCobolAst(input) {
        input = this.preprocessInput(input);
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


        return astCobol;
    }

    getCobolAstAndRewrite(input) {
        var ast = this.getCobolAst(input);

        var rewrittenAst = this.cobolRewritters.reduce((ast, rewriter) => rewriter(ast), ast);
        rewrittenAst.act('analyze');

        return rewrittenAst;
    }

    getCSharpAst(input) {
        var ast = this.getCobolAstAndRewrite(input).toCSharp();
        ast.bindWithParent(); //TODO: it can be rewritter

        var rewrittenAst = this.cSharpRewritters.reduce((ast, rewriter) => rewriter(ast), ast);

        return rewrittenAst;
    }

    getCSharpCode(input) {
        return this.getCSharpAst(input).toSource();
    }
};