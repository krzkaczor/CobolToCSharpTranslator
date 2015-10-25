var _ = require('lodash');

var cobolNodes = require('../cobol/nodes/index');
var csharpNodes = require('./../csharp/nodes/index');
var helper = require('./../csharp/transformerHelper');
var CsharpRuntime = require('./../csharp/Runtime');

function translateChildren(classes, correspondingClass:csharpNodes.ClassDeclaration, children:Array, makeStatic:?boolean = false, genToString:?boolean = false) {
    children.forEach(child => {
        if (child instanceof cobolNodes.GroupItem) {
            correspondingClass.addMember(new csharpNodes.AttributeMember(child.name, classes[helper.translateDataItemName(child.name)], makeStatic, new csharpNodes.RawExpression("new " + helper.translateDataItemName(child.name) + "()")).fromCobol(child));
        } else {
            correspondingClass.addMember(new csharpNodes.AttributeMember(child.name, CsharpRuntime[child.picture.type], makeStatic).fromCobol(child));
        }
    });

    //generate loader for each member


    if (genToString) {
        var sinkVariable = new csharpNodes.SymbolExpression('description');

        var stats = [];
        stats.push(new csharpNodes.VariableDeclaration(sinkVariable, new csharpNodes.RawExpression('""')));

        stats.push(...children.map(child => {
            if (child instanceof cobolNodes.GroupItem) {
                return new csharpNodes.OperatorCall('+=', sinkVariable, new csharpNodes.RawExpression(`${child.name}`));
            }

            if (child.picture.type === 'int') {
                return new csharpNodes.OperatorCall('+=', sinkVariable, new csharpNodes.RawExpression(`${child.name}.ToString("D${child.picture.size}")`));
            }

            if (child.picture.type === 'string') {
                return new csharpNodes.OperatorCall('+=', sinkVariable, new csharpNodes.RawExpression(`${child.name}.PadRight(${child.picture.size})`));
            }
        }));

        stats.push(new csharpNodes.ReturnStatement(sinkVariable));

        correspondingClass.addMember(new csharpNodes.MethodMember("ToString", stats, false, {returnType: new csharpNodes.SymbolExpression('string'), override: true}));
    }
}

function createCSharpRefs(currentRef, nextItem) {
    if (!nextItem || !nextItem._cobolOrigin) return;
    if (!currentRef) {
        currentRef = nextItem;
    }
    nextItem._cobolOrigin.csharpRef = currentRef;
    if (nextItem.members) {
        nextItem.members.forEach(mem => {
            if (mem._cobolOrigin instanceof cobolNodes.GroupItem) {
                createCSharpRefs(new csharpNodes.MemberAccess(currentRef, mem), mem._type);
            } else {
                createCSharpRefs(new csharpNodes.MemberAccess(currentRef, mem), mem);
            }
        });
    }
}

cobolNodes.WorkingStorageSection.prototype.toCSharp = function () {
    //creating schema
    var globalScope = this._parent._parent._globalScope;
    var groupItems = _.values(globalScope.data).filter(g => g instanceof cobolNodes.GroupItem);

    var classes = _.chain(groupItems)
        .map(group => new csharpNodes.ClassDeclaration(helper.translateDataItemName(group.name)).fromCobol(group))
        .indexBy('name')
        .run();

    groupItems.forEach(group => {
        var correspondingClass = classes[helper.translateDataItemName(group.name)];

        translateChildren(classes, correspondingClass, group.children, false, true);
    });

    var dataStore = new csharpNodes.ClassDeclaration('DataStore');
    dataStore.fromCobol(this);
    translateChildren(classes, dataStore, this.variables, true);

    //bind cobol elements to dataStore attributes
    createCSharpRefs(dataStore, dataStore);

    return _.flatten([_.values(classes), dataStore]);
};

cobolNodes.ElementaryItem.prototype.toCSharpAssignment = function(what) {
  return new csharpNodes.AssignmentOperator(this.csharpRef, what.toCSharp());
};

cobolNodes.GroupItem.prototype.toCSharpAssignment = function(what) {
    //todo: refactor member accesow
    var target = new csharpNodes.RawExpression(`${this.csharpRef.toSource()}.load`);
    return new csharpNodes.MethodInvokeExpression(target, [what.toCSharp()]);
};

cobolNodes.GroupItem.prototype.toCSharpString = function() {
    return this.csharpRef;
};

cobolNodes.ElementaryItem.prototype.toCSharpString = function() {
    if (this.picture.type === 'int') {
        return new csharpNodes.RawExpression(
            this.csharpRef.toSource() + "." + 'ToString' + `("D${this.picture.size}")`
        );
    }

    if (this.picture.type === 'string') {
        return new csharpNodes.RawExpression(
            this.csharpRef.toSource() + "." + `PadRight(${this.picture.size})`
        );
    }
}