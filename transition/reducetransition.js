var _              = require('underscore');
var TransitionBase = require('./transitionbase.js');

var ReduceTransition = function(productionNumber) {
  TransitionBase.call(this, 'reduce');
  this.productionNumber = productionNumber;
};

module.exports = ReduceTransition;
