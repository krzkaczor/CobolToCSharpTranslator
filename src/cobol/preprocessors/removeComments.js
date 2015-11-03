/**
 * Removes all comments from cobol source code
 */
module.exports = function(source: string): string {
    return source.replace(/^\s*\*(.*?)(\n|$)/mg, '');
};