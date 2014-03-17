var SyntaxParser      = require('../syntaxparser.js');
var LRParserGenerator = require('../lrparsergenerator/lrparsergenerator.js');
var ObjectTokenizer   = require('../objecttokenizer/objecttokenizer.js');
var _                 = require('underscore');
console.log("Inside /Users/terranceford/JFDL/schema/schema.js, the __dirname is:\n", __dirname);
var Module            = require('../traversal/module.js').directory(__dirname);
var Traversal         = require('../traversal/traversal.js');

var Schema = function Schema(Model) {
//  this._startSymbol = Model.startSymbol;
  Module.call(this, Model);
  this._syntax = Model.syntax;
  this._semantics = Model;
  this._syntaxParser = new SyntaxParser({
//    startSymbol : this._startSymbol
    startSymbol     : this.getId(),
    externalSymbols : this.getDependencies()
  });
  this._grammarData = this._getGrammarData();
  this._generator = new LRParserGenerator(this._grammarData);
  this._parser = this._generator.generate(ObjectTokenizer);
};

_.extend(Schema.prototype, Module.prototype, {


  

  load : function(json, callback) {
    var validationErrors = {};

    this._parser.parse(json, validationErrors);
    if (_.keys(validationErrors).length) {
      return callback(validationErrors);
    }
//    return new this._semantics(json);
    callback(null, new this._semantics(json));
  },

  getNeighbors : function() {
    var neighbors = [];

    _.each(this.getDependencies(), function(dependency) {
      var module = Module.getById(dependency);

      neighbors.push(module);
    });
    return neighbors;
  },

  accumulator : function() {
    var self = this;
    var results = this.parseSyntax();

    return {
      accumulate : function(schema) {
        Array.prototype.push.apply(results, schema.parseSyntax());
      },
      getResults : function() {
        return results;
      }
    };
  },

//  _getGrammarData : function() {
  parseSyntax : function() {
    var syntaxErrors = {};
    var grammarData = this._syntaxParser.parse(this._syntax, syntaxErrors);

    if (_.keys(syntaxErrors).length) {
      throw new Error(this._formatErrors(syntaxErrors));
    }
    return grammarData;
  },

  _getGrammarData : function() {
    var traversal = new Traversal({
      startNode : this
    });
    return traversal.traverse();
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
