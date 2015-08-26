var fs = require('fs');
var path = require('path');

var CobolToCSharpTranslator = require('./CobolToCSharpTranslator');

const SAMPLES_PATH = path.join(__dirname, '../samples/');

var helloWorldSample = fs.readFileSync(path.join(SAMPLES_PATH, 'helloworld.cob')).toString();

console.log(new CobolToCSharpTranslator().emitCSharp(helloWorldSample));
