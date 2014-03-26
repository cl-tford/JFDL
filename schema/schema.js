var SyntaxParser      = require('../syntaxparser.js');
var LRParserGenerator = require('../lrparsergenerator/lrparsergenerator.js');
var ObjectTokenizer   = require('../objecttokenizer/objecttokenizer.js');
var _                 = require('underscore');
var Module            = require('../traversal/module.js').directory(__dirname);
var Traversal         = require('../traversal/traversal.js');

var Schema = function Schema(Model) {
console.log("Inside schema.js, the constructor got called with Model:\n", Model);
//  this._startSymbol = Model.startSymbol;
  Module.call(this, Model);
  this._syntax = Model.syntax;
//  this._semantics = Model;
//  this.semantics = Model;
  this.semantics = Model;

  this._syntaxParser = new SyntaxParser({
//    startSymbol : this._startSymbol
    startSymbol     : this.getId(),
    externalSymbols : this.getDependencies(),
    Module          : Module,
  });

  this._grammarData = this._getGrammarData();
  
  
  this._generator = new LRParserGenerator(this._grammarData);
  this._parser = this._generator.generate(ObjectTokenizer);
console.log("INside schema.js, the constructor, about to return this:\n", this);
  console.log("After all the machinations, the modulesById looks like:\n", Module.modulesById);
  Module.storeModuleById(this.getId(), this);
console.log("After some further machinations, the modulesById looks like:\n", Module.modulesById);
};

_.extend(Schema.prototype, Module.prototype, {


  

  load : function(json, callback) {
    var validationErrors = {};

    var result = this._parser.parse(json, validationErrors);
console.log("The result of parsing the json is:\n", result);
    if (_.keys(validationErrors).length) {
      return callback(validationErrors);
    }
//    return new this._semantics(json);
//    callback(null, new this._semantics(json));
    callback(null, result);
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
