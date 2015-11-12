var _ = require('lodash');
var utils = require('../../utils');
var ClassDeclaration = require('../nodes/ClassDeclaration');
var MethodMember = require('../nodes/MethodMember');
var RawExpression = require('../nodes/RawExpression');
var MethodInvokeExpr= require('../nodes/MethodInvokeExpression');
var Stat = require('../nodes/Statement');
var ThisRefExpr = new require('../nodes/ThisReferenceExpression');
var TypeRefExpr = new require('../nodes/TypeReferenceExpression');
var helper = require('../transformerHelper');

/**
 * Companion methods are methods used to simulate cobol program flow in C# ex. falling to next paragraph
 * @param {Object} compilationUnit
 */
module.exports = function(compilationUnit) {
    compilationUnit.topLevelDeclarations
        .filter(decl => decl instanceof ClassDeclaration && decl.continuousFlow)
        .forEach(cls => {
            var companionMethods = cls.members
                .filter(member => !member.isMain())
                .map(member => {
                var nextMethod = cls.getNextMember(member);

                var companion = new MethodMember(
                    helper.translateMethodNameToCompanionMethodName(member.name),
                    _.compact([
                        new Stat(new MethodInvokeExpr(new TypeRefExpr(member._parent), member.name)),
                        nextMethod? new Stat(new MethodInvokeExpr(new TypeRefExpr(nextMethod._parent), helper.translateMethodNameToCompanionMethodName(nextMethod.name))) : undefined
                    ])
                    ,
                    true
                );

                companion._shadow = true; //won't be found by 'nextMethod' class
                companion._parent = cls;

                member.bindCompanion(companion);
                return companion;
            });

            cls.members = cls.members.concat(companionMethods);
        });

    return compilationUnit;
};