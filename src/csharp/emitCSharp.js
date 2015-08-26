var nodes = require('../cobol/nodes');

nodes.CompilationUnit.prototype.emitCSharp = function () {
    var code = "";
    code += "using System;\n";
    code += "class MainClass\n";
    code += "{\n";
    code += this.procedureDivision.emitCSharp();
    code += "}\n";
    return code;
};

nodes.ProcedureDivision.prototype.emitCSharp = function () {
    var code = "";
    code += "public static void Main (string[] args)\n";
    code += "{\n";
    code += this.paragraphs[0].emitCSharp();
    code += "}\n";
    return code;
};

nodes.Paragraph.prototype.emitCSharp = function () {
    return this.statements.map(stat => stat.emitCSharp() + '\n');
};

nodes.DisplayVerb.prototype.emitCSharp = function() {
    return 'Console.WriteLine ({0});'.format(this.what.emitCSharp());
};

nodes.StringLiteral.prototype.emitCSharp = function() {
    return '"{0}"'.format(this.value);
};