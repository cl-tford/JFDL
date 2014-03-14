var LRParserGenerator = require('./lrparsergenerator/lrparsergenerator.js');
var Production        = require('./production.js');
var SyntaxTokenizer   = require('./objecttokenizer/syntaxtokenizer.js');
var ObjectTokenizer   = require('./objecttokenizer/objecttokenizer.js');
var _                 = require('underscore');
var SyntaxToken       = require('./objecttokenizer/syntaxtoken.js');

//var startSymbol = null;

var DEFAULT_START_SYMBOL = 'START';

//var grammarData = null;

/*
function setStartSymbol(symbol) {
  startSymbol = symbol;
}
*/

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

/*
function compressSyntax(constituents) {
  var path = getKeyPath(this.getStack());
  path.unshift(startSymbol);
  var prefix = path.join('.');
  var production1 = prefix + "PAIRS -> " + prefix + "PAIRS " + prefix + "PAIR";
  var production2 = prefix + "PAIRS -> " + prefix + "PAIR";
  var production3 = prefix + " -> { " + prefix + "PAIRS }";
  var key = path.pop();
  if (path.length) {
    var shallowPrefix = path.join('.');
    var production4 = shallowPrefix + "PAIR -> key_" + key + " " + prefix;
  }
console.log("The productions should be:\n", production1, "\n", production2, "\n", production3, "\n", production4);
  
  return "SYNTAX";
}

function accumulatePairs(constituents) {
  return "PAIRS";
}

function startPairs(constituents) {
  return "PAIRS";
}

function compressPair(constituents) {
  return "PAIR";
}

function syntaxAsValue(constituents) {
  return "VALUE";
}

function atomAsValue(constituents) {
  var atom = constituents[0];
  var keyPath = getKeyPath(this.getStack());
  var key = null;
  var lhs = null;
  var rhs = null;
  var production = null;

  keyPath.unshift(startSymbol);
  key = keyPath.pop();
  lhs = keyPath.join('.') + "PAIR";
  rhs = "key_" + key + " " +  atom.getData();
  production =  lhs + " -> " + rhs;
  console.log("The production should be:\n", production);            
  return "VALUE";
}

function stringAsAtom(constituents) {
  var token = constituents[0];

  return token;
}

function numberAsAtom(constituents) {
  var token = constituents[0];

  return token
}

function booleanAsAtom(constituents) {
  var token = constituents[0];

  return token;
}
*/


/*
var makeReduction = function(type) { 
  return function() { 
    return { 
      type     : type, 
      children : arguments
    }; 
  }; 
};
*/
/*
var productionStrings = [
  'SYNTAX -> { PAIRS }',
  'PAIRS -> PAIRS PAIR',
  'PAIRS -> PAIR',
  'PAIR -> key VALUE',
  'VALUE -> SYNTAX',
  'VALUE -> ATOM',
  'ATOM -> string',
  'ATOM -> number',
  'ATOM -> boolean'
];
*/

/*
var grammarData = [
  { 
    production : 'SYNTAX -> { PAIRS }',
    reduction : compressSyntax
  },
  {
    production : 'PAIRS -> PAIRS PAIR',
    reduction : accumulatePairs
  },
  {
    production : 'PAIRS -> PAIR',
    reduction : startPairs
  },
  {
    production : 'PAIR -> key VALUE',
    reduction : compressPair
  },
  {
    production : 'VALUE -> SYNTAX',
    reduction : syntaxAsValue
  },
  {
    production : 'VALUE -> ATOM',
    reduction : atomAsValue
  },
  {
    production : 'ATOM -> string',
    reduction : stringAsAtom
  },
  {
    production : 'ATOM -> number',
    reduction : numberAsAtom
  },
  {
    production : 'ATOM -> boolean',
    reduction : booleanAsAtom
  }
];
*/
/*
var grammarData = _.map(productionStrings, function(productionString) {
  var type = (new Production(productionString)).lhs;

  return {
    production : productionString,
    reduction  : makeReduction(type)
  };
});
*/

var SyntaxParser = function SyntaxParser(options) {
  this._startSymbol = options.startSymbol || DEFAULT_START_SYMBOL;
  this._grammarData = this._getGrammarData();
  this._generator = new LRParserGenerator(this._grammarData);
  this._parser = this._generator.generate(SyntaxTokenizer);
  this._externalGrammarData = null;
  this._parser.beforeParse(this._initialize());
};

_.extend(SyntaxParser.prototype, {
  parse : function(object, callback) {
    var errors = {};
//    var result = this._parser.parse(object, errors);
    this._parser.parse(object, errors);
    if (_.keys(errors).length) {
      callback(errors);
    }
//    callback(null, result);
//    callback(null, this._externalGrammarData.reverse());
    this._externalGrammarData.reverse();
    var externalGenerator = new LRParserGenerator(this._externalGrammarData);
    callback(null, externalGenerator.generate(ObjectTokenizer));
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
  }

});
/*
var newLRParserGenerator = new LRParserGenerator(grammarData);

var lrparser = newLRParserGenerator.generate(SyntaxTokenizer);

var testObject = {
  "b" : {
    "c" : "string",
    "d" : "number"
  },
  "e" : "boolean"
};

//startSymbol = 'A';
//setStartSymbol('A');

var result = lrparser.parse(testObject);

console.log("The result is:\n", JSON.stringify(result, null, 2));
*/
//module.exports = lrparser;
/*
module.exports = {
  parse : function(object, callback) {
    var errors = {};
    var result = lrparser.parse(object, errors);
    if (_.keys(errors).length) {
      callback(errors);
    }
    callback(null, result);
  }
  setStartSymbol : setStartSymbol
}
*/

module.exports = SyntaxParser;
