//not using ES6 symbols here because of debugging problems


exports.Alphabetic = class Alphabetic {
    toCSharpType() {
        return 'string';
    }
}

exports.Alphanumeric = class Alphanumeric {
    toCSharpType() {
        return 'string';
    }
};

exports.Numeric = class Numeric {
    toCSharpType() {
        return 'int';
    }
};