var Base = require('./Base');

module.exports = class ElementaryItem extends Base {
    constructor(lvl: number, name: string, picture: string) { //todo: picture is tmp
        super();
        this.level = lvl;
        this.name = name;
        this.picture = picture;
    }
};