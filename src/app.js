var fs = require('fs');
var path = require('path');

var program = require('commander');

var CobolToCSharpTranslator = require('./CobolToCSharpTranslator');

program
    .version('1.0.0')
    .usage('[options] file')
    .option('-o, --output [path]', 'output file [path]')
    .parse(process.argv);


var inputFile = program.args[0];
var cobolProgram = fs.readFileSync(inputFile).toString();
var csharpCode = new CobolToCSharpTranslator().getCSharpCode(cobolProgram);

if (!program.output) {
    console.log(csharpCode);
} else {
    var outputFile = program.output;
    fs.writeFileSync(outputFile, csharpCode);
}

process.exit(0);
