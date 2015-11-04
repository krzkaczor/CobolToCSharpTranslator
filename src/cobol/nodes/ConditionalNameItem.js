var Base = require('./Base');
var Picture = require('./Picture');

module.exports = class ConditionalNameItem extends Base {
    constructor(name: string, values: Array<Base>) {
        super();
        this.level = 88;
        this.name = name;
        this.values = values;
    }
};