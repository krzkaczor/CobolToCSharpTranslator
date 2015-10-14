var ClassDeclaration = require('./nodes/ClassDeclaration');

module.exports = {
    int : new ClassDeclaration('int'),
    string  : new ClassDeclaration('string'),

    //very simplified for now
    'Console.WriteLine' : new ClassDeclaration('Console.WriteLine'),
    'Console.Write' : new ClassDeclaration('Console.Write'),
    'System.Environment.Exit' : new ClassDeclaration('System.Environment.Exit')
};