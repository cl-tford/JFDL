var _ = require('underscore');

var StackManager = function() {
  this._stack = null;
};

_.extend(StackManager.prototype, {
  initializeStack : function() {
    this._stack = [];
  },

  getStackTop : function() {
    return this._stack[this._stack.length - 1];
  },

  popMultiple : function(howManyPops) {
    var i = null;
    var poppedValue = null;

    for (i = 0; i < howManyPops; i++) {
      poppedValue = this._stack.pop();
    }
    return poppedValue;
  }
});


module.exports = StackManager;
