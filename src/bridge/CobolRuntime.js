var fs = require('fs');
var path = require('path');
var ClassDeclaration = require('../csharp/nodes/ClassDeclaration');

var RuntimeStructure = {
    CobolRuntime: new ClassDeclaration('CobolRuntime')
};

exports.CobolRuntimeBindings = RuntimeStructure;

exports.attachRuntime = function(source: string): string {
    var runtimeSource = fs.readFileSync(path.join(__dirname, '/CobolRuntime.cs')).toString();

    return [source, runtimeSource].join('\n');
};