var fs = require('fs');
var path = require('path');

var CobolToCSharpTranslator = require('./CobolToCSharpTranslator');

const SAMPLES_PATH = path.join(__dirname, '../samples/');

var helloWorldSample = fs.readFileSync(path.join(SAMPLES_PATH, 'helloworldTwoStats.cob')).toString();

var ast = new CobolToCSharpTranslator().getAST(helloWorldSample);
console.log(require('util').inspect(ast, true, 10));
console.log(new CobolToCSharpTranslator().emitCSharp(helloWorldSample));
