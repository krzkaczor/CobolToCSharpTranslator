var _ = require('lodash');

/**
 * Tiny class to manage symbol table
 * basically it is Map<String, Object>
 * @type {SymbolTable}
 */
module.exports = class SymbolTable {
    constructor() {
        this.data = {};
    }

    set(key: string, value: any) {
        if (_.has(this.data, key)) {
            throw new Error('Symbol does already exist');
        }

        this.data[key] = value;
    }

    get(key: string) {
        var value = this.data[key];

        if (_.isUndefined(value)) {
            throw new Error('Key is not set');
        }

        return value;
    }

    rename(oldKey: string, newKey: string) {
        var value = this.get(oldKey);
        delete this.data['oldKey'];
        this.set(newKey, value);
    }

    contains(key: string) {
        return _.has(this.data, key);
    }
}