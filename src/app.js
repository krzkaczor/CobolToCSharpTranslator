var fs = require('fs');
var path = require('path');

var CobolToCSharpTranslator = require('./CobolToCSharpTranslator');

const SAMPLES_PATH = path.join(__dirname, '../samples/');

var cobolProgram = fs.readFileSync(path.join(SAMPLES_PATH, 'nextFeature.cob')).toString();

//var cobolAst = new CobolToCSharpTranslator().getCobolAst(cobolProgram);
//console.log(require('util').inspect(cobolAst, false, 10));

//var cobolAst = new CobolToCSharpTranslator().getCobolAstAndRewrite(cobolProgram);
//console.log(require('util').inspect(cobolAst, false, 10));

var csharpAst = new CobolToCSharpTranslator().getCSharpAst(cobolProgram);
//console.log(require('util').inspect(csharpAst, false, 10));

console.log(csharpAst.toSource());
