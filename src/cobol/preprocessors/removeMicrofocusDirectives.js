/**
 * This preprocessor removes microfocus specific code
 */
module.exports = function (source) {
    source = source.replace('      $ SET SOURCEFORMAT"FREE"\n', ''); //maybe it should be more generic like all lines beginning with $

    return source;
};