var Base = require('./Base');

module.exports = class CompilationUnit extends Base {
    constructor(identificationData, procedureDivision) {
        super();
        this.identificationData = identificationData;
        this.procedureDivision = procedureDivision;
    }
};