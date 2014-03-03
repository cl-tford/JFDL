var _ = require('underscore');
var Production = require('./production.js');

function Grammar(productions) {
  this.productions = this._initializeProductions(productions);
  this.symbols = null;
  this.hasTerminal = null;
  this.hasNonterminal = null;
  this.productionsFor = {};
  this.maxRHSLength = 0;
  this._analyzeProductions();
}

_.extend(Grammar, {
  newProduction : function(productionString) {
    return new Production(productionString);
  }
});

_.extend(Grammar.prototype, {

  getProduction : function(index) {
    return this.productions[index];
  },

  index : function(production) {
    var i = null;

    for (i = 0; i < this.productions.length; i++) {
      if (this.productions[i].isEqual(production)) {
        return i;
      }
    }
  },

  _initializeProductions : function(productionStrings) {
    var productionObjects = [];

    _.each(productionStrings, function(productionString) {
      productionObjects.push(Grammar.newProduction(productionString));
    });
    return productionObjects;
  },
  
  _analyzeProductions : function() {
    var self = this;

    self.symbols = {};
    self.hasTerminal = {};
    self.hasNonterminal = {};
    _.each(self.productions, function(production) {
      self._analyzeProduction(production);
      if (!self.productionsFor[production.lhs]) {
        self.productionsFor[production.lhs] = [];
      }
      self.productionsFor[production.lhs].push(production);
      if (production.rhs.length > self.maxRHSLength) {
        self.maxRHSLength = production.rhs.length;
      }
    });
  },

  _analyzeProduction : function(production) {
    var self    = this;
    var lhs     = production.lhs;
    var rhs     = production.rhs;
    var symbols = [lhs].concat(rhs);

    _.each(symbols, function(symbol) {
      self.symbols[symbol] = 1;
      if (!self.hasNonterminal[symbol]) {
        self.hasTerminal[symbol] = 1;
      }
      if (symbol === lhs) {
        self.hasNonterminal[lhs] = 1;
        delete self.hasTerminal[symbol];
      }
    });
  }
});

module.exports = Grammar;
