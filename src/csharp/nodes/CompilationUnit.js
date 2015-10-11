var _ = require('lodash');
var Base = require('./Base');

module.exports = class CompilationUnit extends Base {
    constructor(dependencies: Array<string>, topLevelDeclarations: Array<Base>) {
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