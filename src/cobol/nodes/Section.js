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
        this.symbols = new SymbolTable();
        this.fillSymbolTable();
    }

    fillSymbolTable() {
         this.paragraphs.forEach(par => this.symbols.set(par.name, par));
    }
};

