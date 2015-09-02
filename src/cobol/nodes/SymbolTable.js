var _ = require('lodash');

module.exports = class SymbolTable {
    constructor() {
        this.data = {};
    }

    set(key, value) {
        if (_.has(this.data, key)) {
            throw new Error('Symbol does already exist');
        }

        this.data[key] = value;
    }

    get(key) {
        var value = this.data[key];

        if (_.isUndefined(value)) {
            throw new Error('Key is not set');
        }

        return value;
    }

    rename(oldKey, newKey) {
        var value = this.get(oldKey);
        delete this.data['oldKey'];
        this.set(newKey, value);
    }

    contains(key) {
        return _.has(this.data, key);
    }
}