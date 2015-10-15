var Base = require('./Base');
var Picture = require('./Picture');

module.exports = class ElementaryItem extends Base {
    constructor(lvl: number, name: string, picture: Picture) {
        super();
        this.level = lvl;
        this.name = name;
        this.picture = picture;
    }
};