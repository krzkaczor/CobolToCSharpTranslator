var Base = require('./Base');

module.exports = class DisplayVerb extends Base {
    constructor(what) {
        super();
        this.what = what;
    }
};