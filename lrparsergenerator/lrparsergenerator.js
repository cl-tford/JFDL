var _ = require('underscore');
var Grammar = require('../grammar.js');
var util = require('./util.js');

var LRParserGenerator = function(productionStrings) {
  this._grammar = new Grammar(productionStrings);
  this._firsts = this._computeFirsts();
  this._followers = this._computeFollowers();
};

_.extend(LRParserGenerator.prototype, {
  
  _computeFirsts : function() {
    var self = this;
    var changed = null;
    var firsts = self._initializeFirsts();

    changed = true;
    while (changed) {
      changed = false;
      _.each(self._grammar.productions, function(production) {
        var lhs = production.lhs;
        var leftCorner = production.rhs[0];
        if (util.installKeys({
          source : firsts[leftCorner],
          target : firsts[lhs]
        }) > 0) {
          changed = true;
        }
      });
    }
    return firsts;
  },

  _computeFollowers : function() {
    var self = this;
    var changed = null;
    var followers = self._initializeFollowers();

    changed = true;
    while (changed) {
      changed = false;
      _.each(self._grammar.productions, function(production) {
        if (self._installFollowersByProduction(followers, production)) {
          changed = true;
        }
      });
    }
    return followers;
  },

  _installFollowersByProduction : function(followers, production) {
    var changed = false;

    if (this._installRHSFollowers(followers, production)) {
      changed = true;
    }
    if (this._installLHSFollowers(followers, production)) {
      changed = true;
    }
    return changed;
  },

  _installRHSFollowers : function(followers, production) {
    var changed     = false;
    var i           = null;
    var leftSymbol  = null;
    var rightSymbol = null;

    for (i = 1; i < production.rhs.length; i++) {
      leftSymbol = production.rhs[i - 1];
      rightSymbol = production.rhs[i];
      if (this._grammar.hasNonterminal[leftSymbol]) {
        if (util.installKeys({
          source : this._firsts[rightSymbol], 
          target : followers[leftSymbol]
        }) > 0) {
          changed = true;
        }
      }
    }
    return changed;
  },

  _installLHSFollowers : function(followers, production) {
    var lhs     = production.lhs;
    var rhs     = production.rhs;
    var rhsTail = rhs[rhs.length - 1];
    var changed = false;

    if (this._grammar.hasNonterminal[rhsTail]) {
      if (util.installKeys({
        source : followers[lhs],
        target : followers[rhsTail]
      }) > 0) {
        changed = true;
      }
    }
    return changed;
  },

  _initializeFirsts : function() {
    var self = this;
    var firsts = {};
    var grammarSymbols = _.keys(self._grammar.symbols);

    _.each(grammarSymbols, function(symbol) {
      firsts[symbol] = {};
      if (self._grammar.hasTerminal[symbol]) {
        firsts[symbol][symbol] = 1; // Terminals are firsts for themselves.
      }
    });
    return firsts;
  },

  _initializeFollowers : function() {
    var self = this;
    var followers = {};
    var nonterminals = _.keys(self._grammar.hasNonterminal);

    _.each(nonterminals, function(nonterminal) {
      followers[nonterminal] = {};
    });
    return followers;
  }


});



module.exports = LRParserGenerator;
