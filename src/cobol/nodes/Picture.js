var _ = require('lodash');
var Base = require('./Base');
var CobolTypes = require('../CobolTypes');

function unwrapPicString(picString) {
    var wrappedRegEx = /(.)\(([0-9]+)\)/;
    var results = picString.match(wrappedRegEx);
    if (!results) {
        return picString;
    } else {
        return picString.replace('('+results[2]+')', _.repeat(results[1], results[2] - 1));
    }
}

module.exports = class Picture extends Base {
    constructor(picString: string) {
        super();

        //parse picture string
        var unwrappedPicString = unwrapPicString(picString);
        if (_.contains(unwrappedPicString, 'A') || _.contains(unwrappedPicString, 'X')) {
            this.size = unwrappedPicString.length;

            var typeChar = unwrappedPicString[0];
            let type;
            switch(typeChar) {
                case 'A' : type = new CobolTypes.Alphabetic(); break;
                case 'X' : type = new CobolTypes.Alphanumeric(); break;
            }
            this.type = type;
        } else if (_.contains(unwrappedPicString, '9')) {
            if (_.startsWith(unwrappedPicString, 'S')) {
                this.size = unwrappedPicString.length - 1;
                this.type = new CobolTypes.Numeric({signed: true});
            } else {
                this.size = unwrappedPicString.length;
                this.type = new CobolTypes.Numeric();
            }
        }
    }
};