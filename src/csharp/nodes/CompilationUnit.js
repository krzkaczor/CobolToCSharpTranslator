var Base = require('./Base');

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
        var code = "";
        code += this.dependencies.map(dep => "using {0};\n".format(dep)).reduce((a, b) => a + b, "");
        code += this.topLevelDeclarations.map(decl => decl.toSource()).reduce((a, b) => a + b, "");
        return code;
    }
};