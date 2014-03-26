var LRParserGenerator = require('./lrparsergenerator/lrparsergenerator.js');
var Production        = require('./production.js');
var SyntaxTokenizer   = require('./objecttokenizer/syntaxtokenizer.js');
var ObjectTokenizer   = require('./objecttokenizer/objecttokenizer.js');
var _                 = require('underscore');
var SyntaxToken       = require('./objecttokenizer/syntaxtoken.js');
//var Module            = require('./traversal/module.js');

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
  this._externalSymbols = options.externalSymbols || [];
//  this._externalSymbols = options.externalSymbols || {};
  this._Module = options.Module
  this._grammarData = this._getGrammarData();
  this._generator = new LRParserGenerator(this._grammarData);
  this._parser = this._generator.generate(SyntaxTokenizer);
  this._externalGrammarData = null;
  this._parser.beforeParse(this._initialize());
};

_.extend(SyntaxParser, {
//  constructObject : function(constituents) {
//  constructObject : function(Constructor) {


  absorbPair : function() {
    return function _absorbPair(constituents) {
      var keyValuePairs = constituents[0];
      var pair = constituents[1];
      
      keyValuePairs[pair.key] = pair.value;
      return keyValuePairs;
    };
  },
    
  startKeyValuePairs : function() {
    return function _startKeyValuePairs(constituents) {
      var pair = constituents[0];
      var keyValuePairs = {};
      
      keyValuePairs[pair.key] = pair.value;
      return keyValuePairs;
    };
  },
    
  recordPair : function() {
    return function _recordPair(constituents) {
      console.log("Inside recordPair, got called with constituents:\n", constituents);
      var key = constituents[0].getData();
      var value = constituents[1];

      if (value.getData && typeof value.getData === 'function') {
        value = value.getData();
      }
      
      var pair = {
        key : key,
        value : value
      };
      console.log("Inside recordPair, about to return:\n", pair);
      return pair;
    };
  },
    
  extractData : function() {
    return function _extractData(constituents) {
      return constituents[0].getData();
    };
  },
    
  transitiveUp : function() {
      return function(constituents) {
        return constituents[0];
      };
  }
});

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
        reduction : this._nonterminalAsValue()
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
//    this._addExternalGrammarData(grammarData);//
    return grammarData.concat(this._getExternalGrammarData());
  },

  _getExternalGrammarData : function() {
    var self = this;
    var externalGrammarData = [];
    
    _.each(self._externalSymbols, function(externalSymbol) {
      externalGrammarData.push({
        production : 'VALUE -> ' + externalSymbol,
//        reduction  : self._nonterminalAsValue()
        reduction : SyntaxParser.transitiveUp()
      });
    });
    return externalGrammarData;
  },

  _getConstructor : function(symbol) {
console.log("Inside /Users/terranceford/JFDL/syntaxparser.js._getConstructor, got called with symbol:\n", symbol);
    if (this._startSymbol === symbol ||
        this._externalSymbols.indexOf(symbol) > -1) {
console.log("INside /Users/terranceford/JFDL/syntaxparser.js._getConstructor, about to return the semantics of:\n", this._Module.getById(symbol));
      return this._Module.getById(symbol).semantics;
    }
console.log("Inside /Users/terranceford/JFDL/syntaxparser.js._getConstructor, about to return Object\n");
    return Object;
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
      productions.push({
        production : prefix + "PAIRS -> " + prefix + "PAIRS " + prefix + "PAIR",
        reduction : SyntaxParser.absorbPair()
      });
      productions.push({
        production : prefix + "PAIRS -> " + prefix + "PAIR",
        reduction : SyntaxParser.startKeyValuePairs()
      });
/*
      productions.push({
        production : prefix + " -> { " + prefix + "PAIRS }",
        reduction : SyntaxParser.constructObject(this._getConstructor(path[path.length - 1])
      });
*/
      key = path.pop();
      productions.push({
        production : prefix + " -> { " + prefix + "PAIRS }",
//        reduction : SyntaxParser.constructObject(key)
        reduction : self._constructObject(key)
      });
      if (path.length) {
        shallowPrefix = path.join('.');
        productions.push({
          production : shallowPrefix + "PAIR -> key_" + key + " " + prefix,
          reduction : SyntaxParser.recordPair()
        });
      }
console.log("Inside /Users/terranceford/JFDL/syntaxparser.js._compressSyntax, about to return the following productions:\n", productions);
//      productions = _.map(productions, function(productionString) {
//        return {
//          production : productionString
//        };
//      });
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
        production : production,
        reduction : SyntaxParser.recordPair()
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

  _nonterminalAsValue : function() {
    var self = this;

    return function nonterminalAsValue(constituents) {
      var nonterminal = constituents[0].getData();
      var path        = getKeyPath(this.getStack());
      var key         = null;
      var lhs         = null;
      var rhs         = null;

      path.unshift(self._startSymbol);
      key = path.pop();
      lhs = path.join('.') + "PAIR";
      rhs = 'key_' + key + " " + nonterminal;

      self._externalGrammarData.push({
        production : lhs + " -> " + rhs,
        reduction : SyntaxParser.recordPair()
      });
      return constituents[0];
    };
  },

  _constructObject : function(key) {
    var self = this;

    return function constructObject(constituents) {
console.log("Inside constructObject, The key is:\n", key);
      var leftBrace     = constituents[0];
      var keyValuePairs = constituents[1];
      var rightBrace    = constituents[2];
      var Constructor = self._getConstructor(key);
      console.log("Inside constructObject, the constituents (leftBrace, keyVAluePairs, rightBrace) are:\n", leftBrace, "\n", keyValuePairs, "\n", rightBrace);
      
//      return new A(keyValuePairs);
      console.log("The about to try and construct using Constructor:\n", Constructor);
      return new Constructor(keyValuePairs);
    };
  },

});

module.exports = SyntaxParser;

