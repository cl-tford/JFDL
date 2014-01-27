var _ = require('underscore');
var StackManager = require('../stackmanager.js');
var ObjectFrame = require('./objectframe.js');
var ObjectToken = require('./objecttoken.js');

var ObjectTokenizer = function(object) {
  StackManager.call(this);
  this.initializeStack();
  this._object = object;
  this._started = false;
};

_.extend(ObjectTokenizer.prototype, StackManager.prototype, {
  getNextToken : function() {
console.log("Inside /Users/terranceford/JFDL/objecttokenizer/objecttokenizer.js, getNextToken, got called.\n");
    var stackTop = this.getStackTop();
    var nextToken = null;

    if (!stackTop && this._started) {
      return null;
    }
    if (!stackTop && !this._started) {
      this._stack.push(new ObjectFrame(this._object));
      this._started = true;
      return ObjectToken.START;
    }
    if (nextToken = stackTop.getNextToken()) { 

      // The object has not been used up yet.
console.log("Inside /Users/terranceford/JFDL/objecttokenizer/objecttokenizer.js, about to handle token:\n", nextToken);
      return this._handleNextToken(nextToken);
    }

    // Else, The object frame has just ended.
    this._stack.pop();
    return ObjectToken.STOP;
  },

  _handleNextToken : function(nextToken) {

    // Return keys or atomic values.
    if (nextToken.isKey() || 
        nextToken.getAtomicDataType()) {

      return nextToken;
    }
    
    // Otherwise, start a whole new object.
    this._stack.push(new ObjectFrame(nextToken._data));
//    return OBJECT_START_TOKEN;
    return ObjectToken.START;
  }
});

module.exports = ObjectTokenizer;
