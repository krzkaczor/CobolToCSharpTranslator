var _ = require('lodash');
var Base = require('./Base');
var SymbolTable = require('./SymbolTable');

const DEFAULT_SECTION_NAME = 'Runner';

module.exports = class Section extends Base {
    constructor(name, freeSentences, paragraphs) {
        super();
        this.name = name;
        this.freeSentences = freeSentences;
        this.paragraphs = paragraphs;
        this.symbolTable = new SymbolTable();
        this.fillSymbolTable();
    }

    fillSymbolTable() {
         this.paragraphs.forEach(par => this.symbolTable.set(par.name, par));
    }

    unshiftParagraph(par) {
        this.paragraphs.unshift(par);
        this.symbolTable.set(par.name, par);

        return this;
    }

    /**
     * This could be moved to rewriter
     */
    renameParagraph(par, newName) {
        this.symbolTable.rename(par.name, newName);
        par.name = newName;

        return this;
    }
};

