var Base = require('./Base');

module.exports = class IntLiteral extends Base {
    constructor(value) {
        super();
        this.value = value;
    }
};