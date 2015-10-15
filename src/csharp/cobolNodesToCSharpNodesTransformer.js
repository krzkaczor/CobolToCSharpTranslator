var _ = require('lodash');

var cobolNodes = require('../cobol/nodes');
var csharpNodes = require('./nodes');
var helper = require('./transformerHelper');
var CsharpRuntime = require('./Runtime');

cobolNodes.CompilationUnit.prototype.toCSharp = function () {
    var dataDivison = this.dataDivision.toCSharp();
    var procedureDivision = this.procedureDivision.toCSharp();

    var classes = _.flatten([dataDivison, procedureDivision]);

    return new csharpNodes.CompilationUnit(['System'], classes);
};

cobolNodes.DataDivision.prototype.toCSharp = function() {
    return this.workingStorageSection.toCSharp();
};

cobolNodes.WorkingStorageSection.prototype.toCSharp = function() {
    function translateChildren(correspondingClass: csharpNodes.ClassDeclaration, children: Array, makeStatic: ?boolean = false) {
        children.forEach(child => {
            if (child instanceof cobolNodes.GroupItem) {
                correspondingClass.addMember(new csharpNodes.AttributeMember(child.name, classes[helper.translateDataItemName(child.name)], makeStatic, new csharpNodes.RawExpression("new " + helper.translateDataItemName(child.name) + "()")).fromCobol(child));
            } else {
                correspondingClass.addMember(new csharpNodes.AttributeMember(child.name, CsharpRuntime[child.picture.type], makeStatic).fromCobol(child));
            }
        });
    }

    //creating schema
    var globalScope = this._parent._parent._globalScope;
    var groupItems = _.values(globalScope.data).filter(g => g instanceof cobolNodes.GroupItem);

    var classes = _.chain(groupItems)
        .map(group => new csharpNodes.ClassDeclaration(helper.translateDataItemName(group.name)).fromCobol(group))
        .indexBy('name')
        .run();

    groupItems.forEach(group => {
        var correspondingClass = classes[helper.translateDataItemName(group.name)];

        translateChildren(correspondingClass, group.children);
    });

    var dataStore = new csharpNodes.ClassDeclaration('DataStore');
    dataStore.fromCobol(this);
    translateChildren(dataStore, this.variables, true);

    //bind cobol elements to dataStore attributes
    //_.values(globalScope).forEach(

    rec(dataStore, dataStore);
    function rec(currentRef, nextItem) {
        if (!nextItem) return;
        if (!currentRef) {currentRef = nextItem;}
        nextItem._cobolOrigin.csharpRef = currentRef;
        if (nextItem.members) {
            nextItem.members.forEach(mem => {
                if (mem._cobolOrigin instanceof cobolNodes.GroupItem) {
                    rec(new csharpNodes.MemberAccess(currentRef, mem), mem._type);
                } else {
                    rec(new csharpNodes.MemberAccess(currentRef, mem), mem);
                }
            });
        }
    }

    return _.flatten([_.values(classes), dataStore]);
};

cobolNodes.ProcedureDivision.prototype.toCSharp = function () {
    var procedureClasses =  helper.allToCSharp(this.sections);

    procedureClasses.forEach(cls => cls.continuousFlow = true);

    return procedureClasses;
};

cobolNodes.Section.prototype.toCSharp = function() {
    return new csharpNodes.ClassDeclaration(this.name, helper.allToCSharp(this.paragraphs));
};

cobolNodes.Paragraph.prototype.toCSharp = function () {
    //flatten all sentences into one big array of C# statements
    var stats = _.flatten(this.sentences.map(sent => sent.statements));

    return new csharpNodes.MethodMember(this.name, helper.allToCSharp(stats), true);
};

cobolNodes.StopRunVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression(CsharpRuntime['System.Environment.Exit'], ['0']);
};

cobolNodes.GoToVerb.prototype.toCSharp = function() {
    //thanks to memoization we WILL get the same translated object
    return new csharpNodes.MethodInvokeExpression(new csharpNodes.RawExpression(helper.translateMethodNameToCompanionMethodName(this.target.name)));
};

cobolNodes.PerformVerb.prototype.toCSharp = function() {
    return new csharpNodes.MethodInvokeExpression(this.target.toCSharp()); //thanks to memoization we WILL get the same translated object
};

cobolNodes.DisplayVerb.prototype.toCSharp = function() {
    var printFunction = this.advancing? CsharpRuntime['Console.WriteLine'] : CsharpRuntime['Console.Write'];
    return new csharpNodes.MethodInvokeExpression(printFunction, [this.what.toCSharp()]);
};

cobolNodes.StringLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('"{0}"'.format(this.value));
};

cobolNodes.IntLiteral.prototype.toCSharp = function() {
    return new csharpNodes.PrimitiveExpression('{0}'.format(this.value));
};

cobolNodes.MoveVerb.prototype.toCSharp = function() {
    return new csharpNodes.AssignmentOperator(this.target.csharpRef, this.what.toCSharp());
};

cobolNodes.SymbolExpression.prototype.toCSharp = function() {
    return this.target.csharpRef;
};