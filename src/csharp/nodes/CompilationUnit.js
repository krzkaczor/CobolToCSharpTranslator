var Base = require('./Base');
var code = require('code-gen');

module.exports = class CompilationUnit extends Base {
    /**
     * @param dependencies {Array} - array of dependencies (using ...)
     * @param topLevelDeclarations {Array} - top level declarations like classes, interfaces etc
     */
    constructor(dependencies, topLevelDeclarations) {
        super();
        this.dependencies = dependencies;
        this.topLevelDeclarations = topLevelDeclarations;
    }

    toSource() {
        var res = code.for([
            code.for(this.dependencies).withTemplate('using {0};').withNewLine(),
            code.for(this.topLevelDeclarations).withNewLine()
        ]).withNewLine();

        debugger;

        return res.compile();

    }
};