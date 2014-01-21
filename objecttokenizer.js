var _ = require('underscore');
var ObjectFrame = require('./objectframe.js');
var ObjectToken = require('./objecttoken.js');

var OBJECT_START_TOKEN = new ObjectToken({
  type : 'delimiter',
  data : '{'
});

var OBJECT_STOP_TOKEN = new ObjectToken({
  type : 'delimiter',
  data : '}'
});

var ObjectTokenizer = function(object) {
  this._object = object;
  this._started = false;
//  this._stack = [new ObjectFrame(object)];
  this._stack = [];
};

_.extend(ObjectTokenizer.prototype, {
  getNextToken : function() {
    var stackTop = this._getStackTop();
    var nextToken = null;

    if (!stackTop && this._started) {
      return null;
    }
    if (!stackTop && !this._started) {
      this._stack.push(new ObjectFrame(this._object));
      this._started = true;
      return OBJECT_START_TOKEN;
    }
    if (nextToken = stackTop.getNextToken()) { 

      // The object has not been used up yet.
      return this._handleNextToken(nextToken);
    }

    // Else, The object frame has just ended.
    this._stack.pop();
    return OBJECT_STOP_TOKEN;
  },

  _handleNextToken : function(nextToken) {

    // Return keys or atomic values.
    if (nextToken.isKey() || 
        nextToken.isAtomicValue()) {

      return nextToken;
    }
    
    // Otherwise, start a whole new object.
    this._stack.push(new ObjectFrame(nextToken._data));
    return OBJECT_START_TOKEN;
  },

  _getStackTop : function() {
    return this._stack[this._stack.length - 1];
  }
});

module.exports = ObjectTokenizer;
