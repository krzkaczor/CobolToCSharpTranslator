var Base = require('./Base');

module.exports = class DisplayVerb extends Base {
    constructor(what, advancing) {
        super();
        this.what = what;
        this.advancing = advancing;
    }
};