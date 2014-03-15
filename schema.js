var SyntaxParser      = require('./syntaxparser.js');
var LRParserGenerator = require('./lrparsergenerator/lrparsergenerator.js');
var ObjectTokenizer   = require('./objecttokenizer/objecttokenizer.js');
var _                 = require('underscore');

var Schema = function Schema(Model) {
  this._startSymbol = Model.startSymbol;
  this._syntax = Model.syntax;
  this._semantics = Model;
  this._syntaxParser = new SyntaxParser({
    startSymbol : this._startSymbol
  });
  this._grammarData = this._getGrammarData();
  this._generator = new LRParserGenerator(this._grammarData);
  this._parser = this._generator.generate(ObjectTokenizer);
};

_.extend(Schema.prototype, {
  load : function(json, callback) {
    var validationErrors = {};

    this._parser.parse(json, validationErrors);
    if (_.keys(validationErrors).length) {
      return callback(validationErrors);
    }
//    return new this._semantics(json);
    callback(null, new this._semantics(json));
  },

  _getGrammarData : function() {
    var syntaxErrors = {};
    var grammarData = this._syntaxParser.parse(this._syntax, syntaxErrors);

    if (_.keys(syntaxErrors).length) {
      throw new Error(this._formatErrors(syntaxErrors));
    }
    return grammarData;
  },

  _formatErrors : function(syntaxErrors) {
    var messages = [];

    _.each(syntaxErrors, function(message) {
      messages.push(message);
    });
    return messages.join("\n");
  }
});

module.exports = Schema;
