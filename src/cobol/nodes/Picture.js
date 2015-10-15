var Base = require('./Base');

module.exports = class Picture extends Base {
    constructor(type: string, size: number) {
        super();
        this.type = type;
        this.size = size;
    }
};