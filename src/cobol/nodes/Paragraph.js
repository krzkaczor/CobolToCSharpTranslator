var Base = require('./Base');

module.exports = class Paragraph extends Base {
    constructor(name:string, sentences:Array<Base>) {
        super();
        this.name = name;
        this.sentences = sentences;
    }

};