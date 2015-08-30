var fs = require('fs');
var path = require('path');

var CobolToCSharpTranslator = require('./CobolToCSharpTranslator');

const SAMPLES_PATH = path.join(__dirname, '../samples/');

var cobolProgram = fs.readFileSync(path.join(SAMPLES_PATH, 'sectionsHelloWorld.cob')).toString();

var cobolAst = new CobolToCSharpTranslator().getCobolAst(cobolProgram);
var csharpAst = new CobolToCSharpTranslator().getCSharpAst(cobolProgram);

console.log(require('util').inspect(csharpAst, true, 10));

console.log(csharpAst.toSource());
//console.log(new CobolToCSharpTranslator().emitCSharp(cobolProgram));
