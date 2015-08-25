var fs = require('fs');
var path = require('path');
var jison = require('jison');

const GRAMMAR_PATH = path.join(__dirname, 'cobol/grammar');
const SAMPLES_PATH = path.join(__dirname, '../samples/');

function combineGrammar() {
    var lexer  = fs.readFileSync(path.join(GRAMMAR_PATH, 'lexer.jisonlex'), 'utf8');
    var parser = fs.readFileSync(path.join(GRAMMAR_PATH, 'parser.jison'), 'utf8');

    //alter rules to match actual data structure
    //lexer = lexer.replace(/return[ ]?o[ ]?\(/g, "return yy.lexerHelper.call(this,");
    //parser = parser.replace(/new[ ]+([.a-zA-Z])?/g, "new yy.nodes.$1");

    return lexer + parser;
}

var grammar = combineGrammar();

var parser = new jison.Parser(grammar);


var helloWorldSample = fs.readFileSync(path.join(SAMPLES_PATH, 'helloworld.cob')).toString();
parser.parse(helloWorldSample);