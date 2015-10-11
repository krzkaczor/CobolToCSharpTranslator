var Base = require('./Base');

module.exports = class DisplayVerb extends Base {
    constructor(what: Base, advancing: ?boolean) {
        super();
        this.what = what;
        this.advancing = advancing || false;
    }
};