var _ = require('lodash');
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
        var code = this.dependencies.map(dep => "using {0};\n".format(dep)).join('');
        code += this.allToSource(this.topLevelDeclarations).join('');
        return code;
    }

    getNextClass(decl) {
        return this.topLevelDeclarations[_.findIndex(this.topLevelDeclarations, d => d=== decl) + 1];
    }
};