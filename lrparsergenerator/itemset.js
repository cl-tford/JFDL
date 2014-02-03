var _ = require('underscore');
var Item = require('./item.js');

var ItemSet = function(options) {
  this.key = null;
  this._grammar = options.grammar;
  this._itemsByKey = {};
  this._stack = [];
}

_.extend(ItemSet.prototype, {
  addItem : function(item) {
    this._itemsByKey[item.key] = item;
  },

  hasItem : function(item) {
    return (this._itemsByKey[item.key]) ? true : false;
  },

  newItem : function(production) {
    return new Item({
      grammar    : this._grammar,
      production : production,
      position   : 0
    });
  },

  computeClosure : function() {
    this._stack = _.values(this._itemsByKey);
    var item = null;
    var symbol = null;

    while (this._stack.length) {
      item = this._stack.shift();
      symbol = item.getSymbol();
      if (this._grammar.hasNonterminal(symbol)) {
        this._addPredictedItems(symbol);
      }
    }
console.log("Inside computeClosure, the calling object looks like:\n", this);
console.log("about to call _computeKey\n");
    this.key = this._computeKey();
    return this.key;
  },

  _addPredictedItems : function(symbol) {
    var self = this;

    var productions = self._grammar.productionsFor[symbol];
    _.each(productions, function(production) {
      var proposedItem = self.newItem(production);
      if (!self.hasItem(proposedItem)) {
        self.addItem(proposedItem);
        self._stack.push(proposedItem);
      }
    });
  },

  _computeKey : function() {
console.log("Inside _computeKey, got called\n");
    var itemKeys = _.map(_.values(this._itemsByKey), function(item) {
      return item.key;
    });
    
    itemKeys.sort(function(a, b) {
      return Number(a) - Number(b);
    });
console.log("The sorted item keys are:\n", itemKeys);
    return itemKeys.join('_');
  }
});

module.exports = ItemSet;
