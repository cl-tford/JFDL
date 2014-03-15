var LRParserGenerator = require('./lrparsergenerator/lrparsergenerator.js');
var Production        = require('./production.js');
var SyntaxTokenizer   = require('./objecttokenizer/syntaxtokenizer.js');
var ObjectTokenizer   = require('./objecttokenizer/objecttokenizer.js');
var _                 = require('underscore');
var SyntaxToken       = require('./objecttokenizer/syntaxtoken.js');

var DEFAULT_START_SYMBOL = 'START';

function getKeyPath(stack) {
  var path = [];

  _.each(stack, function(stackElement) {
    if (stackElement instanceof SyntaxToken) {
      if (stackElement.isKey()) {
        path.push(stackElement.getData());
      }
    }
  });
  return path;
}

var SyntaxParser = function SyntaxParser(options) {
  this._startSymbol = options.startSymbol || DEFAULT_START_SYMBOL;
  this._grammarData = this._getGrammarData();
  this._generator = new LRParserGenerator(this._grammarData);
  this._parser = this._generator.generate(SyntaxTokenizer);
  this._externalGrammarData = null;
  this._parser.beforeParse(this._initialize());
};

_.extend(SyntaxParser.prototype, {
  parse : function(object, errors) {
    if (!errors) {
      errors = {};
    }

    this._parser.parse(object, errors);
    if (_.keys(errors).length) {
      return null;
    }
    return this._externalGrammarData.reverse();
  },

  _initialize : function() {
    var self = this;

    return function initialize() {
      self._externalGrammarData = [];
    }
  },

  _getGrammarData : function() {
    var grammarData = [
      { 
        production : 'SYNTAX -> { PAIRS }',
        reduction : this._compressSyntax()
      },
      {
        production : 'PAIRS -> PAIRS PAIR',
        reduction : this._accumulatePairs()
      },
      {
        production : 'PAIRS -> PAIR',
        reduction : this._startPairs()
      },
      {
        production : 'PAIR -> key VALUE',
        reduction : this._compressPair()
      },
      {
        production : 'VALUE -> SYNTAX',
        reduction : this._syntaxAsValue()
      },
      {
        production : 'VALUE -> ATOM',
        reduction : this._atomAsValue()
      },
      {
        production : 'VALUE -> ' + this._startSymbol,
        reduction : this._startSymbolAsValue()
      },
      {
        production : 'ATOM -> string',
        reduction : this._stringAsAtom()
      },
      {
        production : 'ATOM -> number',
        reduction : this._numberAsAtom()
      },
      {
        production : 'ATOM -> boolean',
        reduction : this._booleanAsAtom()
      }
    ];
    return grammarData;
  },

  _compressSyntax : function() {
    var self = this;

    return function compressSyntax(constituents) {
      var path = getKeyPath(this.getStack());
      var productions = [];
      var prefix = null;
      var key = null;
      var shallowPrefix = null;

      path.unshift(self._startSymbol);
      prefix = path.join('.');
      productions.push(prefix + "PAIRS -> " + prefix + "PAIRS " + prefix + "PAIR");
      productions.push(prefix + "PAIRS -> " + prefix + "PAIR");
      productions.push(prefix + " -> { " + prefix + "PAIRS }");
      key = path.pop();
      if (path.length) {
        shallowPrefix = path.join('.');
        productions.push(shallowPrefix + "PAIR -> key_" + key + " " + prefix);
      }
      productions = _.map(productions, function(productionString) {
        return {
          production : productionString
        };
      });
      Array.prototype.push.apply(self._externalGrammarData, productions);
      return "SYNTAX";
    };
  },

  _accumulatePairs : function() {
    var self = this;

    return function accumulatePairs(constituents) {
      return "PAIRS";
    };
  },

  _startPairs : function() {
    var self = this;
    
    return function startPairs(constituents) {
      return "PAIRS";
    };
  },


  _compressPair : function() {
    var self = this;

    return function compressPair(constituents) {
      return "PAIR";
    };
  },

  _syntaxAsValue : function() {
    var self = this;

    return function syntaxAsValue(constituents) {
      return "VALUE";
    };
  },

  _atomAsValue : function() {
    var self = this;

    return function atomAsValue(constituents) {
      var atom = constituents[0];
      var keyPath = getKeyPath(this.getStack());
      var key = null;
      var lhs = null;
      var rhs = null;
      var production = null;
      
      keyPath.unshift(self._startSymbol);
      key = keyPath.pop();
      lhs = keyPath.join('.') + "PAIR";
      rhs = "key_" + key + " " +  atom.getData();
      production =  lhs + " -> " + rhs;
      self._externalGrammarData.push({
        production : production
      });
      return "VALUE";
    };
  },
    
  _stringAsAtom : function() {
    var self = this;

    return function stringAsAtom(constituents) {
      var token = constituents[0];
      
      return token;
    };
  },

  _numberAsAtom : function() {
    var self = this;

    return function numberAsAtom(constituents) {
      var token = constituents[0];
      
      return token;
    };
  },

  _booleanAsAtom : function() {
    var self = this;

    return function booleanAsAtom(constituents) {
      var token = constituents[0];
      
      return token;
    };
  },

  _startSymbolAsValue : function() {
    var self = this;

    return function startSymbolAsValue(constituents) {
      var startSymbol = constituents[0].getData();
      var path = getKeyPath(this.getStack());
      path.unshift(self._startSymbol);
      var key = path.pop();
      console.log("Inside startSymbolAsValue, the key path is:\n", getKeyPath(this.getStack()));
      var lhs = path.join('.') + "PAIR";
      var rhs = 'key_' + key + " " + startSymbol;
console.log("inside startSymbolAsValue, before pushing onto externalGrammarData, it looks like:\n", self._externalGrammarData);
      self._externalGrammarData.push({
        production : lhs + " -> " + rhs
      });
console.log("Inside startSymbolAsValue, after pushing, externalGrammarData looks like:\n", self._externalGrammarData);
      return constituents[0];
    };
  }

});

module.exports = SyntaxParser;
