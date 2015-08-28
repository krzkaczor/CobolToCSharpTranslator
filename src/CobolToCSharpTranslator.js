require('./utils');

var fs = require('fs');
var path = require('path');
var jison = require('jison');
var nodes = require('./cobol/nodes');
var csharpEmitter = require('./csharp/emitCSharp');
var csharpTransformer = require('./csharp/cobolNodesToCSharpNodesTransformer');

const GRAMMAR_PATH = path.join(__dirname, 'cobol/grammar');

module.exports = class CobolToCSharpTranslator {
    combineGrammar() {
        var lexer  = fs.readFileSync(path.join(GRAMMAR_PATH, 'lexer.jisonlex'), 'utf8');
        var parser = fs.readFileSync(path.join(GRAMMAR_PATH, 'parser.jison'), 'utf8');

        //alter rules to match actual data structure
        //lexer = lexer.replace(/return[ ]?o[ ]?\(/g, "return yy.lexerHelper.call(this,");
        parser = parser.replace(/new[ ]+([.a-zA-Z])?/g, "new yy.nodes.$1");

        return lexer + parser;
    }

    constructor() {
        var grammar = this.combineGrammar();
        this.parser = new jison.Parser(grammar);

        this.parser.yy = {
            nodes: nodes
        };
    }

    getCobolAst(input) {
        return this.parser.parse(input);
    }

    getCSharpAst(input) {
        return this.getCobolAst(input).toCSharp();
    }

    getCSharpCode(input) {
        return this.getCSharpAst(input).toSource();
    }
};