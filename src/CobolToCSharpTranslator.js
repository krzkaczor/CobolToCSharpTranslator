require('babel-core/polyfill');
require('./polyfills');

require('./bridge/attachTransformer');
require('./bridge/typeBridge');

var fs = require('fs');
var path = require('path');

var antlr4 = require('antlr4');
var Cobol85Lexer = require('./cobol/parser/Cobol85Lexer').Cobol85Lexer;
var Cobol85Parser = require('./cobol/parser/Cobol85Parser').Cobol85Parser;
var Cobol85Visitor = require('./cobol/parser/Cobol85Visitor').Cobol85Visitor;

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

function loadPostprocessor(name) {
    return require(`./csharp/postprocessors/${name}`);
}

module.exports = class CobolToCSharpTranslator {
    constructor() {
        this.preprocessors = [
            loadPreprocessor('removeMicrofocusDirectives'),
            loadPreprocessor('removeComments')
        ];

        this.cobolRewritters = [
            loadCobolRewritter('createRunnerSection').bind(undefined, 'Runner'),
            loadCobolRewritter('moveFreeStatementsToParagraph').bind(undefined, 'main'),
            loadCobolRewritter('hierarchizeWorkingStorage')
        ];

        this.cSharpRewritters = [
            loadCSharpRewritter('createCompanionMethods')
        ];

        this.postprocessors = [loadPostprocessor('codeFormatter')];
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
        ast.bindWithParent();
        ast.act('analyze');

        var rewrittenAst = this.cSharpRewritters.reduce((ast, rewriter) => rewriter(ast), ast);

        return rewrittenAst;
    }

    getCSharpCode(input) {
        var sourceCode = this.getCSharpAst(input).toSource();
        var postprocessedSource = this.postprocessors.reduce((source, processor) => processor(source), sourceCode);

        return postprocessedSource;
    }
};