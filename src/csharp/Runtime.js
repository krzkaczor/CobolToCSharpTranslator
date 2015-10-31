var ClassDeclaration = require('./nodes/ClassDeclaration');

module.exports = {
    int : new ClassDeclaration('int'),
    Int32 : new ClassDeclaration('Int32'),
    string  : new ClassDeclaration('string'),

    Console : new ClassDeclaration('Console'),
    //this should be a namespace
    System : {
        Environment : new ClassDeclaration('System.Environment')
    }
};