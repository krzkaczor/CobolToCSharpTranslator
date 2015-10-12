var Base = require('./Base');
var DataDivision = require('./DataDivision');
var ProcedureDivision = require('./ProcedureDivision');

module.exports = class CompilationUnit extends Base {
    constructor(identificationData: Object, dataDivision: DataDivision, procedureDivision: ProcedureDivision) {
        super();
        this.identificationData = identificationData;
        this.dataDivision = dataDivision;
        this.procedureDivision = procedureDivision;
    }
};