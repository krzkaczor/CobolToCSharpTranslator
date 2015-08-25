var Base = require('./Base');

module.exports = class StringLiteral extends Base {
    constructor(value) {
        super();
        this.value = value;
    }
};