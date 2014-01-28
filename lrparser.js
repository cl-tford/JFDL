var _               = require('underscore');
var ObjectTokenizer = require('./objecttokenizer/objecttokenizer.js');
var ObjectToken     = require('./objecttokenizer/objecttoken.js');
var StackManager    = require('./stackmanager.js');

var LRParser = function(options) {
  StackManager.call(this);
  this.grammar = options.grammar || [];
  this.table  = options.table || [];
  this.acceptingState = options.acceptingState || 0;
};

_.extend(LRParser.prototype, StackManager.prototype, {

  parse : function(object, error) {
    var transition = null;
    
    error = error || {};
    this._tokenizer = new ObjectTokenizer(object);
    this.initializeStack();
    this._state = 0;
    this._token = null;
    while (true) {
      this._loadToken();
      transition = this._getTransition();
      if (!transition) {
        error.reason = this._buildErrorMessage();
        return null; // Failure :(
      }
      if (transition.isShift()) {
        if (transition.state == this.acceptingState) {
          return this.getStackTop(); // Success!
        }
        this._shift(transition);
      } else { // Action is reduce.
        this._reduce(transition);
      }
    }
  },

  _loadToken : function() {
    if (this._token) {
      return; // Token already loaded.
    }
    this._token = this._tokenizer.getNextToken() || ObjectToken.EOF;
  },

  _getTransition : function() {
    var tokenId = this._token.getId();

    return this.table[this._state][tokenId];
  },

  _shift : function(transition) {
    this._stack.push(this._state);
    this._stack.push(this._token)
    this._token = null;
    this._state = transition.state;
  },

  _reduce : function(transition) {
    var production    = this.grammar[transition.productionNumber];
    var lhs           = production.lhs;
    var previousState = this.popMultiple(production.rhs.length * 2);
    var newState      = this.table[previousState][lhs].newState;

    this._stack.push(previousState);
    this._stack.push(lhs);
    this._state = newState;
  },

  _buildErrorMessage : function() {
    var keyPath          = this._tokenizer.getKeyPath();
    var objectFrame      = this._tokenizer.getStackTop();
    var errorMessage     = null;
    var stringifiedValue = null;

    if (objectFrame.wasOnValue()) {
      stringifiedValue = JSON.stringify(this._token._data);
      errorMessage = 'Unexpected value ' + stringifiedValue + ' for ' + keyPath;
    } else {
      errorMessage = 'Unexpected key ' + keyPath;
    }
    return errorMessage;
  }

});

module.exports = LRParser;
