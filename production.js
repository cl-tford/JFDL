var _ = require('underscore');

function isArrow(symbol) {
  var isArrowRegex = /\-\>/;

  return isArrowRegex.test(symbol);
}

var Production = function(symbols) {
  Production.checkFormat(symbols);
  this._symbols = symbols;
  this.lhs = symbols[0];
  this.rhs = symbols.slice(2);
};

_.extend(Production, {
  checkFormat : function(symbols) {
    if (symbols.length < 3 ||
        !isArrow(symbols[1])) {
      
      throw new Error("Production format not valid.");
    }
  }

});

module.exports = Production;
