var Base = require('./Base');

module.exports = class StringLiteral extends Base {
    constructor(value: string) {
        super();
        this.value = value;
    }
};