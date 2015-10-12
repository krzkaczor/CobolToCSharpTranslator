var Base = require('./Base');

module.exports = class WorkingStorageSection extends Base {
    constructor(variables: Array<Base>) {
        super();
        this.variables = variables;
    }
};