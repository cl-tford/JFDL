var ObjectTokenizer = require('../objecttokenizer/objecttokenizer.js');
var SyntaxParser = require('../syntaxparser.js');
var LRParserGenerator = require('../lrparsergenerator/lrparsergenerator.js');
var _ = require('underscore');

var Schema = function Schema(options) {
  this._id = options.id;
  this._parser = this._makeParser();
};

_.extend(Schema.prototype, {
  load : function(json, callback) {
    var validationErrors = {};
    var result = this._parser.parse(json, validationErrors);

    if (_.keys(validationErrors).length) {
      return callback(validationErrors);
    }
    callback(null, result);
  },
  _makeParser : function() {
    var stack = [this._id];
    var visited = {};
    var grammarData = [];

    while (stack.length) {
      var id = stack.pop();
      if (!visited[id]) {
        var json = this._getJson(id);
        var syntax = json.syntax;
        var dependencies = json.dependencies;
        var syntaxParser = new SyntaxParser({
          startSymbol     : id,
          externalSymbols : dependencies
        });
        Array.prototype.push.apply(grammarData, syntaxParser.parse(syntax));
        Array.prototype.push.apply(stack, dependencies);
        visited[id] = true;
      }
    }
    var generator = new LRParserGenerator(grammarData);
    return generator.generate(ObjectTokenizer);
  },

  _getJson : function(id) {
    var id = id.toLowerCase();
    var filename = './' + id + '/' + id + '.json';

    return require(filename);
  }
});

module.exports = Schema;
