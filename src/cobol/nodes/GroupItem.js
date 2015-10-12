var Base = require('./Base');
var ElementaryItem = require('./ElementaryItem');

module.exports = class GroupItem extends Base {
    constructor(lvl: number, name: string) {
        super();
        this.level = lvl;
        this.name = name;
        this.children = [];
    }
};