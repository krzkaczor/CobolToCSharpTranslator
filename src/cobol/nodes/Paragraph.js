var Base = require('./Base');

module.exports = class Paragraph extends Base {
    constructor(name, sentences) {
        super();
        this.name = name;
        this.sentences = sentences;
    }

};