var Base = require('./Base');
var ProcedureDivision = require('./ProcedureDivision');

module.exports = class CompilationUnit extends Base {
    constructor(identificationData: Object, procedureDivision: ProcedureDivision) {
        super();
        this.identificationData = identificationData;
        this.procedureDivision = procedureDivision;
    }
};