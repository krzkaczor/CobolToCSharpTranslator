var Base = require('./Base');
var WorkingStorageSection = require('./WorkingStorageSection');

module.exports = class DataDivision extends Base {
    constructor(workingStorageSection: ?WorkingStorageSection) {
        super();
        this.workingStorageSection = workingStorageSection || new WorkingStorageSection([]);
    }
};