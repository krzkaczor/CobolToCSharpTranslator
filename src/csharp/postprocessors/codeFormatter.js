var edge = require('edge');
var libPath = require('../../PROJECT_DIRS').lib;
var join = require('path').join;

var dependencies = [
    'Microsoft.CodeAnalysis.CSharp.Workspaces.dll',
    'System.Collections.Immutable.dll',
    'System.Composition.Runtime.dll',
    'Microsoft.CodeAnalysis.CSharp.dll',
    'System.Composition.AttributedModel.dll',
    'System.Composition.TypedParts.dll',
    'Microsoft.CodeAnalysis.Workspaces.dll',
    'System.Composition.Convention.dll',
    'System.Reflection.Metadata.dll',
    'Microsoft.CodeAnalysis.dll',
    'System.Composition.Hosting.dll',
    'System.Runtime.dll',
    'System.Text.Encoding.dll',
    'System.Threading.Tasks.dll'
];
var fullPathDependencies = dependencies.map(dep => join(libPath, dep));

var formatter = edge.func({
    source: function () {/*
     using System;
     using System.Threading.Tasks;
     using Microsoft.CodeAnalysis;
     using Microsoft.CodeAnalysis.CSharp;
     using Microsoft.CodeAnalysis.Formatting;


     public class Startup
     {
     public async Task<object> Invoke(string input)
     {
     var tree = CSharpSyntaxTree.ParseText (input);
     var workspace = new AdhocWorkspace ();
     var formattedResult = Formatter.Format (tree.GetRoot (), workspace);
     return formattedResult.ToFullString ();
     }
     }
     */
    },
    references: fullPathDependencies
});

/**
 * Formats c# code using roslyn. It is invoked using edge.js.
 * @param {string} sourceCode
 * @returns {string}
 */
module.exports = function (sourceCode:string) {
    return formatter(sourceCode, true);
};