var _ =  require('lodash');
var memoize = require('memoizee');

module.exports = class Base {
    constructor() {
        this.TYPE = "cobol." + this.constructor.name;


        //TODO: cobol classes should not know about c#
        if (this.toCSharp) {
            this.toCSharp = memoize(this.toCSharp.bind(this));
        }
    }

    bindWithParent(parent) {
        var bindBaseElement = (element) => {
            if (element instanceof Base) {
                element.bindWithParent(this);
            }
        };

        _.values(this).forEach(element => {
            if (_.isArray(element)) {
                element.forEach(bindBaseElement);
            } else {
                bindBaseElement(element);
            }
        });

        if (parent) {
            this.parent = parent;
        }
    }

    /**
     * Try running given function recursively
     * @param {function | String} func
     */
    act(func, data) {
        //that name rocks
        var fireOnlyOnChildren = (element) => {
            if (element instanceof Base) {
                element.act(func, data);
            }
        };

        data = data || {};

        //autowire properties with scope
        if (_.has(this, 'symbolTable')) {
            data.symbolTable = this.symbolTable;
        }

        if (_.has(this, '_globalScope')) {
            data._globalScope = this._globalScope;
            debugger;
        }

        if (this[func]) {
            this[func](data);
        } else if(_.isFunction(func)) {
            func.apply(this, data);
        }

        _.pairs(this).filter(kv => kv[0] !== 'parent').map(kv => kv[1]).forEach(element => {
            if (_.isArray(element)) {
                element.forEach(fireOnlyOnChildren);
            } else {
                fireOnlyOnChildren(element);
            }
        });
    }
};