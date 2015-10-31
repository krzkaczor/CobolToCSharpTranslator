var _ =  require('lodash');

/**
 * Try running given function recursively
 * @param {function | String} func
 */
function act(node, func, data) {
    //that name rocks
    var fireOnlyOnChildren = (element) => {
        var CobolBase = require('../cobol/nodes/Base');
        var CSharpBase = require('../csharp/nodes/Base');

        if (element instanceof CobolBase || element instanceof CSharpBase) {
            element.act(func, data);
        }
    };

    data = data || {};

    //autowire properties with scope
    if (_.has(node, 'symbolTable')) {
        data.symbolTable = node.symbolTable;
    }

    if (_.has(node, '_globalScope')) {
        data._globalScope = node._globalScope;
    }

    if (node[func]) {
        node[func](data);
    } else if(_.isFunction(func)) {
        func.apply(node, data);
    }

    _.pairs(node).filter(kv => !_.startsWith(kv[0], '_')).map(kv => kv[1]).forEach(element => {
        if (_.isArray(element)) {
            element.forEach(fireOnlyOnChildren);
        } else {
            fireOnlyOnChildren(element);
        }
    });
}

module.exports = act;