var _ = require('lodash');

var cobolNodes = require('../cobol/nodes/index');
var csharpNodes = require('./../csharp/nodes/index');
var CsharpRuntime = require('./../csharp/Runtime');
var helper = require('./../csharp/transformerHelper');
var Stat = csharpNodes.Statement;
var AssignStat = csharpNodes.AssignStatement;
var TypeRefExpr = csharpNodes.TypeReferenceExpression;
var AssignmentStat = csharpNodes.AssignStatement;
var MemberAccessExpr = csharpNodes.MemberAccessExpression;
var MethodInvokeExpr = csharpNodes.MethodInvokeExpression;
var ParameterDecl = csharpNodes.ParameterDeclaration;
var PrimitiveExpr = csharpNodes.PrimitiveExpression;
var ThisRefExpr = csharpNodes.ThisReferenceExpression;
var VariableRefExpr = csharpNodes.VariableReferenceExpression;

function generateLoaderMethod(children) {
    var cursor = 0;

    var stats = children.map(child => {
        let stat;
        let expr = new MethodInvokeExpr(new VariableRefExpr('inputData'), 'Substring', [new PrimitiveExpr(cursor), new PrimitiveExpr(child.picture.size)]);
        if (child.picture.type == 'int') {
            expr = new MethodInvokeExpr(new TypeRefExpr(CsharpRuntime.Int32), 'Parse', [expr]);
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

        cursor += child.picture.size;
        return stat;
    });

    return new csharpNodes.MethodMember('Load', stats, false, {
        parameters: [new ParameterDecl(new TypeRefExpr(CsharpRuntime.string), 'inputData')]
    });
}

function generateLoadFromKeyboardMethod() {
    let inputVariable = new VariableRefExpr('inputFromKeyboard');
    let stats = [
        new csharpNodes.VariableDeclaration(inputVariable, new MethodInvokeExpr(new TypeRefExpr(CsharpRuntime.Console), 'ReadLine')),
        new Stat(new MethodInvokeExpr(new ThisRefExpr(), 'Load', [inputVariable]))
    ];

    return new csharpNodes.MethodMember('LoadFromKeyboard', stats, false);
}

function translateChildren(classes, correspondingClass:csharpNodes.ClassDeclaration, children:Array, makeStatic: ?boolean = false, genToString: ?boolean = false, genLoader: ?boolean = false, genLoadFromKeyboardMethod: ?boolean = false) {
    children.forEach(child => {
        if (child instanceof cobolNodes.GroupItem) {
            correspondingClass.addMember(new csharpNodes.AttributeMember(child.name, classes[helper.translateDataItemName(child.name)], makeStatic, new csharpNodes.RawExpression("new " + helper.translateDataItemName(child.name) + "()")).bindToCobol(child));
        } else {
            correspondingClass.addMember(new csharpNodes.AttributeMember(child.name, CsharpRuntime[child.picture.type], makeStatic).bindToCobol(child));
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
        stats.push(new csharpNodes.VariableDeclaration(sinkVariable, new csharpNodes.RawExpression('""')));

        stats.push(...children.map(child => {
            if (child instanceof cobolNodes.GroupItem) {
                return new AssignStat(sinkVariable, new csharpNodes.RawExpression(`${child.name}`), '+');
            }

            if (child.picture.type === 'int') {
                return new AssignStat(sinkVariable, new csharpNodes.RawExpression(`${child.name}.ToString("D${child.picture.size}")`), '+');
            }

            if (child.picture.type === 'string') {
                return new AssignStat(sinkVariable, new csharpNodes.RawExpression(`${child.name}.PadRight(${child.picture.size})`), '+');
            }
        }));

        stats.push(new csharpNodes.ReturnStatement(sinkVariable));

        correspondingClass.addMember(new csharpNodes.MethodMember("ToString", stats, false, {
            returnType: new TypeRefExpr(CsharpRuntime.string),
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
                createCSharpRefs(new MemberAccessExpr(currentRef, mem.name), mem._type);
            } else {
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
        .map(group => new csharpNodes.ClassDeclaration(helper.translateDataItemName(group.name)).bindToCobol(group))
        .indexBy('name')
        .run();

    groupItems.forEach(group => {
        var correspondingClass = classes[helper.translateDataItemName(group.name)];

        translateChildren(classes, correspondingClass, group.children, false, true, true, true);
    });

    var dataStore = new csharpNodes.ClassDeclaration('DataStore');
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

cobolNodes.ElementaryItem.prototype.toCSharpKeyboardLoader= function (what) {
    let expr = new MethodInvokeExpr(new TypeRefExpr(CsharpRuntime.Console), 'ReadLine');
    if (this.picture.type == 'int') {
        expr = new MethodInvokeExpr(new TypeRefExpr(CsharpRuntime.Int32), 'Parse', [expr]);
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
    if (this.picture.type === 'int') {
        return new csharpNodes.RawExpression(
            this._csharpRef.toSource() + "." + 'ToString' + `("D${this.picture.size}")`
        );
    }

    if (this.picture.type === 'string') {
        return new csharpNodes.RawExpression(
            this._csharpRef.toSource() + "." + `PadRight(${this.picture.size})`
        );
    }
};