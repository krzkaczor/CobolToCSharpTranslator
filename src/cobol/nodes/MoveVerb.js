var Base = require('./Base');

module.exports = class MoveVerb extends Base {
    constructor(where, what) {
        super();
        this.where = where;
        this.what = what;
    }
};