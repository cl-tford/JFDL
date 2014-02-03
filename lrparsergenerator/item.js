var _ = require('underscore');

var Item = function(options) {
console.log("Inside Item constructor, got called with options:\n");
  this._grammar = options.grammar;
  this._production = options.production;
  this._position = options.position;
console.log("Inside Item constructor, about to call _computeKey\n");
  this.key = this._computeKey();
};

_.extend(Item.prototype, {
  getSymbol : function() {
    return this._production.rhs[this._position];
  },
  
  _computeKey : function() {
console.log("Inside /Users/terranceford/JFDL/lrparsergenerator/item.js._computeKey, got called\n");
//    var mod = this._grammar.maxProductionLength;
    var mod = this._grammar.maxRHSLength;
    var prodNum = this._grammar.index(this._production);
console.log("Inside /Users/terranceford/JFDL/lrparsergenerator/item.js._computeKey, about to return: \n", prodNum * mod + this._position);
    return prodNum * mod + this._position;
  }
});

module.exports = Item;
