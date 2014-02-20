var Grammar          = require('../grammar.js');
var LRParser         = require('../lrparser.js');
var ShiftTransition  = require('../transition/shifttransition.js');
var ReduceTransition = require('../transition/reducetransition.js');
var GotoTransition   = require('../transition/gototransition.js');
var ItemSet          = require('./itemset.js');
var Item             = require('./item.js');
var util             = require('./util.js');
var _                = require('underscore');

var LRParserGenerator = function(productionStrings) {
  this._grammar = new Grammar(productionStrings);
  this._firsts = this._computeFirsts();
  this._followers = this._computeFollowers();
  this._transitionTable = null;
};

_.extend(LRParserGenerator.prototype, {
  
  generate : function() {
    var initialItemset = this._createInitialItemset();
    var currentItemset = null;

    this._itemsetIndices = {};
    this._transitionTable = [];
    this._addItemset(initialItemset);
    this._unprocessedItemsets = [initialItemset];
    while (this._unprocessedItemsets.length) {
      currentItemset = this._unprocessedItemsets.shift();
console.log("Inside generate, considering itemset:\n", currentItemset);
      this._processItemset(currentItemset);
    }
    return new LRParser({
      grammar : this._grammar,
      table   : this._transitionTable
    });
  },

  _processItemset : function(itemset) {
console.log("Inside processItemset, got called, about to makeAllSymbolTransitions\n");
    this._makeAllSymbolTransitions(itemset);
console.log("Inside processItemset, about to addAllReductions.\n");
    this._addAllReductions(itemset);
  },

  _makeAllSymbolTransitions : function(itemset) {
console.log("Inside makeAllSymbolTransitions, got called.\n");
    var self = this;
console.log("Inside makeAllSymbolTransitions, about to loop through the itemset's readyFor hash, which looks like:\n", itemset.readyFor);
    _.each(itemset.readyFor, function(items, symbol) {
      var newItemset = self._makeSymbolTransition(itemset, symbol);
      if (newItemset) {
        self._unprocessedItemsets.push(newItemset);
      }
    });
  },

  _addAllReductions : function(itemset) {
console.log("Inside addAllReductions, got called.\n");
    var self  = this;
    var state = self._indexItemset(itemset);

    _.each(itemset.completeItems, function(completeItem) {
      self._addReductions(state, completeItem);
    });
  },

  _makeSymbolTransition : function(itemset, symbol) {
console.log("Inside makeSymbolTransition, got called with itemset, symbol:\n", itemset, symbol);
    var transition      = null;
    var state           = this._indexItemset(itemset);
console.log("inside makeSymbolTransition, the result of indexItemset is:\n", state);
    var proposedItemset = this._advanceItemset(itemset, symbol);
    var isNew           = this._containsItemset(proposedItemset);
    var newState        = this._indexItemset(proposedItemset);

    if (this._grammar.hasTerminal[symbol]) {
      transition = new ShiftTransition(newState);
    } else { // Symbol is nonterminal
      transition = new GotoTransition(newState);
    }
    this._installTransition(state, symbol, transition);
    if (isNew) {
      return proposedItemset;
    } else {
      return null;
    }
  },

  _addReductions : function(state, item) {
    var self = this;
    var productionNumber = self._indexProduction(item.production);
    var reduction = new ReduceTransition(productionNumber);

    _.each(self._followers[item.production.lhs], function(symbol) {
      self._installTransition(state, symbol, reduction);
    });
  },

  _createInitialItemset : function() {
    var initialItemset = new ItemSet({
      grammar : this._grammar
    });
    
    initialItemset.addItem(new Item({
      grammar    : this._grammar,
      production : this._grammar.productions[0],
      position   : 0
    }));
    initialItemset.computeClosure();
    return initialItemset;
  },

  _advanceItemset : function(itemset, symbol) {
    var advancedItemset = new ItemSet({
      grammar : this._grammar
    });

    _.each(itemset.readyFor[symbol], function(item) {
      advancedItemset.addItem(item.advance());
    });
    advancedItemset.computeClosure();
    return advancedItemset;
  },

  _indexItemset : function(itemset) {
console.log("Inside indexItemset, got called.\n");
    if (this._containsItemset(itemset)) {
console.log("Inside indexItemset, think this already contains the itemset\n");
      return this._itemsetIndices[itemset.key];
    }
console.log("Inside indexItemsets, about to addItemset and return result.\n");
    return this._addItemset(itemset);
  },

  _installTransition : function(state, symbol, transition) {
console.log("INside _installTransition, got called with state, symbol:\n", state, symbol);
console.log("inside /Users/terranceford/JFDL/lrparsergenerator/lrparsergenerator.js._installTransition, the current transition table looks like:\n", this._transitionTable);
    this._transitionTable[state][symbol] = transition;
  },

  _containsItemset : function(itemset) {
    if (this._itemsetIndices[itemset.key] !== undefined) {
      return true;
    }
    return false;
  },
  
  _addItemset : function(itemset) {
//    var newItemsetIndex = this._itemsetIndices.length;
    var newItemsetIndex = this._transitionTable.length;

    this._transitionTable.push({});
    this._itemsetIndices[itemset.key] = newItemsetIndex;
    return newItemsetIndex;
  },

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
