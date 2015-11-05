var Base = require('./Base');
var Picture = require('./Picture');

module.exports = class ConditionalNameItem extends Base {
    constructor(name: string, values: Array<Base>, thru: ?boolean = false) {
        super();
        this.level = 88;
        this.name = name;
        this.values = values;
        this.thru = thru;
    }
};