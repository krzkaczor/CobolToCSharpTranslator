var _ = require('lodash');

var cobolNodes = require('../cobol/nodes/index');
var CobolTypes= require('../cobol/CobolTypes');
var csNodes = require('./../csharp/nodes/index');
var csRuntime = require('./../csharp/Runtime');
var helper = require('./../csharp/transformerHelper');
var Stat = csNodes.Statement;
var AssignStat = csNodes.AssignStatement;
var TypeRefExpr = csNodes.TypeReferenceExpression;
var AssignmentStat = csNodes.AssignStatement;
var MemberAccessExpr = csNodes.MemberAccessExpression;
var MethodInvokeExpr = csNodes.MethodInvokeExpression;
var ParameterDecl = csNodes.ParameterDeclaration;
var PrimitiveExpr = csNodes.PrimitiveExpression;
var ThisRefExpr = csNodes.ThisReferenceExpression;
var VariableRefExpr = csNodes.VariableReferenceExpression;

function generateLoaderMethod(children) {
    var cursor = 0;

    var stats = children.map(child => {
        let stat;
        let expr = new MethodInvokeExpr(new VariableRefExpr('inputData'), 'Substring', [new PrimitiveExpr(cursor), new PrimitiveExpr(child.picture.size || 0)]);
        if (child.picture.type instanceof CobolTypes.Numeric) {
            expr = new MethodInvokeExpr(new TypeRefExpr(csRuntime.Int32), 'Parse', [expr]);
        }

        if (child instanceof cobolNodes.ElementaryItem) {
            stat = new AssignmentStat(
                new MemberAccessExpr(new ThisRefExpr(), child.name),
                expr
            );
        }

        if (child instanceof cobolNodes.GroupItem) {
            stat = new Stat(new MethodInvokeExpr(
                new MemberAccessExpr(new ThisRefExpr(), child.name),
                'Load',
                [expr]
            ));
        }

        cursor += child.picture.size || 0;
        return stat;
    });

    return new csNodes.MethodMember('Load', stats, false, {
        parameters: [new ParameterDecl(new TypeRefExpr(csRuntime.string), 'inputData')]
    });
}

function generateLoadFromKeyboardMethod() {
    let inputVariable = new VariableRefExpr('inputFromKeyboard');
    let stats = [
        new csNodes.VariableDeclaration(inputVariable, new MethodInvokeExpr(new TypeRefExpr(csRuntime.Console), 'ReadLine')),
        new Stat(new MethodInvokeExpr(new ThisRefExpr(), 'Load', [inputVariable]))
    ];

    return new csNodes.MethodMember('LoadFromKeyboard', stats, false);
}

function conditionalNameUpdate(conditionalNameItem: cobolNodes.ConditionalNameItem) {
    let valueRef = new VariableRefExpr('value');
    let boolExpression;

    if (!conditionalNameItem.thru) {
        boolExpression = conditionalNameItem.values
            .map(val => new csNodes.BinaryOperatorCall('==', valueRef, val.toCSharp()))
            .reduce((expr, next) => new csNodes.BinaryOperatorCall('||', expr, next));
    } else {
        boolExpression = new csNodes.BinaryOperatorCall('&&',
            new csNodes.BinaryOperatorCall('>=', valueRef, conditionalNameItem.values[0].toCSharp()),
            new csNodes.BinaryOperatorCall('<=', valueRef, conditionalNameItem.values[1].toCSharp())
        );
    }

    return new AssignmentStat(new VariableRefExpr(conditionalNameItem.name), boolExpression);
}

function generatePropertyForElementaryItem(name: string, picture: cobolNodes.Picture, isStatic: boolean, init: ?cobolNodes.Base, child: cobolNodes.Base, conditionalNameItems: Array<cobolNodes.Base>) {
    var backingFieldName = '_'+name;
    var getter = [
        new csNodes.ReturnStatement(new VariableRefExpr(backingFieldName))
    ];

    var conditionalNameItemsAttributes = conditionalNameItems.map(cond =>
        new csNodes.AttributeMember(cond.name, new TypeRefExpr(csRuntime['bool']), isStatic, undefined).bindWithCounterpart(cond)
    );

    var setter;
    var rawSetter, rawProp;

    let valueRef = new VariableRefExpr('value');
    let backingFieldRef = new VariableRefExpr(backingFieldName);

    if (picture.type instanceof CobolTypes.Numeric) {
        setter = _.compact([
            picture.type.generateSetterGuard(picture.size),
            new AssignmentStat(backingFieldRef, valueRef),
            picture.type.generateSetterTransformation(backingFieldRef),
            ...conditionalNameItems.map(conditionalNameUpdate)
        ]);

    } else {
        setter = [
            new AssignmentStat(new VariableRefExpr(backingFieldName), valueRef)
        ]
    }

    var property = new csNodes.PropertyMember(name, new TypeRefExpr(csRuntime[picture.type.toCSharpType()]), isStatic, getter, setter).bindWithCounterpart(child);

    var stringProp = new csNodes.PropertyMember(name+'Str', new TypeRefExpr(csRuntime['string']), isStatic, [
        new csNodes.ReturnStatement(picture.type.toCobolString(backingFieldRef, picture.size))
    ]);

    return _.compact([
        new csNodes.AttributeMember(backingFieldName, new TypeRefExpr(csRuntime[picture.type.toCSharpType()]), isStatic, init? init.toCSharp() : undefined, true).bindWithCounterpart(child),
        property,
        stringProp,
        ...conditionalNameItemsAttributes
    ]);
}

function translateChildren(classes, correspondingClass:csNodes.ClassDeclaration, children:Array, makeStatic: ?boolean = false, genToString: ?boolean = false, genLoader: ?boolean = false, genLoadFromKeyboardMethod: ?boolean = false) {
    children.forEach(child => {
        if (child instanceof cobolNodes.GroupItem) {
            correspondingClass.addMember(new csNodes.AttributeMember(child.name, new TypeRefExpr(classes[helper.translateDataItemName(child.name)]), makeStatic, new csNodes.RawExpression("new " + helper.translateDataItemName(child.name) + "()")).bindToCobol(child));
        } else {
            correspondingClass.addMember(generatePropertyForElementaryItem(child.name, child.picture, makeStatic, child.init, child, child.children));
        }
    });

    if (genLoader) {
        correspondingClass.addMember(generateLoaderMethod(children));
    }

    if (genLoadFromKeyboardMethod) {
        correspondingClass.addMember(generateLoadFromKeyboardMethod(children));
    }

    if (genToString) {
        var sinkVariable = new VariableRefExpr('description');

        var stats = [];
        stats.push(new csNodes.VariableDeclaration(sinkVariable, new csNodes.RawExpression('""')));

        stats.push(...children.map(child => {
            if (child instanceof cobolNodes.GroupItem) {
                return new AssignStat(sinkVariable, new csNodes.RawExpression(`${child.name}`), '+');
            }

            return new AssignStat(sinkVariable, child.picture.type.toCobolString(child.name, child.picture.size), '+');
        }));

        stats.push(new csNodes.ReturnStatement(sinkVariable));

        correspondingClass.addMember(new csNodes.MethodMember("ToString", stats, false, {
            returnType: new TypeRefExpr(csRuntime.string),
            override: true
        }));
    }
}

function createCSharpRefs(currentRef, nextItem) {
    if (!nextItem || !nextItem._cobolRef) return;

    nextItem._cobolRef._csharpRef = currentRef;
    if (nextItem.members) {
        nextItem.members.forEach(mem => {
            if (mem._cobolRef instanceof cobolNodes.GroupItem) {
                createCSharpRefs(new MemberAccessExpr(currentRef, mem.name), mem._type._type);
            } else if (mem._cobolRef) {
                createCSharpRefs(new MemberAccessExpr(currentRef, mem.name), mem);
            }
        });
    }
}

cobolNodes.WorkingStorageSection.prototype.toCSharp = function () {
    //creating schema
    var globalScope = this._parent._parent._globalScope;
    var groupItems = _.values(globalScope.data).filter(g => g instanceof cobolNodes.GroupItem);

    var classes = _.chain(groupItems)
        .map(group => new csNodes.ClassDeclaration(helper.translateDataItemName(group.name)).bindToCobol(group))
        .indexBy('name')
        .run();

    groupItems.forEach(group => {
        var correspondingClass = classes[helper.translateDataItemName(group.name)];

        translateChildren(classes, correspondingClass, group.children, false, true, true, true);
    });

    var dataStore = new csNodes.ClassDeclaration('DataStore');
    dataStore.bindWithCounterpart(this);
    translateChildren(classes, dataStore, this.variables, true);

    //bind cobol elements to dataStore attributes
    createCSharpRefs(new TypeRefExpr(dataStore), dataStore);

    return _.flatten([_.values(classes), dataStore]);
};

cobolNodes.ElementaryItem.prototype.toCSharpAssignment = function (what) {
    return new AssignStat(this._csharpRef, what.toCSharp());
};

cobolNodes.GroupItem.prototype.toCSharpAssignment = function (what) {
    return new Stat(new MethodInvokeExpr(this._csharpRef, 'Load', [what.toCSharp()]));
};

cobolNodes.ElementaryItem.prototype.toCSharpRawAssignment = function (what) {
    return new AssignStat(this._csharpRef, what.toCSharp().limitTo(this.picture.size));
};

cobolNodes.GroupItem.prototype.toCSharpRawAssignment = function (what) {
    return new Stat(new MethodInvokeExpr(this._csharpRef, 'Load', [what.toCSharp().limitTo(this.picture.size)]));
};

cobolNodes.ElementaryItem.prototype.toCSharpKeyboardLoader= function (what) {
    let expr = new MethodInvokeExpr(new TypeRefExpr(csRuntime.Console), 'ReadLine');

    if (this.picture.type instanceof CobolTypes.Numeric) {
        expr = new MethodInvokeExpr(new TypeRefExpr(csRuntime.Int32), 'Parse', [expr]);
    }
    return new AssignmentStat(this._csharpRef, expr);
};

cobolNodes.GroupItem.prototype.toCSharpKeyboardLoader = function (what) {
    return new Stat(new MethodInvokeExpr(this._csharpRef, 'LoadFromKeyboard'));
};

cobolNodes.GroupItem.prototype.toCSharpString = function () {
    return this._csharpRef;
};

cobolNodes.ElementaryItem.prototype.toCSharpString = function () {
    var strGetter = new MemberAccessExpr(this._csharpRef.left, this._csharpRef.right + 'Str');
    return strGetter;
};