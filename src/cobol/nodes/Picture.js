var _ = require('lodash');
var Base = require('./Base');
var TYPES = require('../CobolTypes');

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
        this.size = unwrappedPicString.length;
        if (_.contains(picString, 'A') || _.contains(picString, 'X')) {
            var typeChar = unwrappedPicString[0];
            let type;
            switch(typeChar) {
                case 'A' : type = new TYPES.Alphabetic(); break;
                case 'X' : type = new TYPES.Alphanumeric(); break;
            }
            this.type = type;
        }
        if (picString[0] === '9') {
            this.type = new TYPES.Numeric();
        }
    }
};