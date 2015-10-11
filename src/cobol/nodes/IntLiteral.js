var Base = require('./Base');

module.exports = class IntLiteral extends Base {
    constructor(value: number) {
        super();
        this.value = value;
    }
};