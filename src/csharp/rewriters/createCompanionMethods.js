var _ = require('lodash');
var utils = require('../../utils');
var ClassDeclaration = require('../nodes/ClassDeclaration');
var MethodMember = require('../nodes/MethodMember');
var MethodInvokeExpression = require('../nodes/MethodInvokeExpression');

const COMPANION_METHOD_POSTIFX = 'AndContinue';

/**
 * Companion methods are methods used to simulate cobol program flow in C# ex. falling to next paragraph
 * @param {Object} compilationUnit
 */
module.exports = function(compilationUnit) {
    compilationUnit.topLevelDeclarations
        .filter(decl => decl instanceof ClassDeclaration && decl.continuousFlow)
        .forEach(cls => {
            var companionMethods = cls.members.filter(mem => !mem.isMain()).map(member => {
                var nextMethod = cls.getNextMember(member);
                var companion = new MethodMember(
                    member.name+COMPANION_METHOD_POSTIFX,
                    utils.removeUndefinedEntries([
                        new MethodInvokeExpression(member),
                        nextMethod? new MethodInvokeExpression(`${nextMethod._parent.name}.${nextMethod.name}${COMPANION_METHOD_POSTIFX}`) : undefined //we cannot use here findCompanion method because we are creating companion right now
                    ]),
                    true
                );

                companion._shadow = true; //won't be found by 'nextMethod' class
                companion._parent = cls;
                return companion;
            });

            cls.members = cls.members.concat(companionMethods);
        });

    return compilationUnit;
};