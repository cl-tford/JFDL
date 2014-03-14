var _               = require('underscore');
var ObjectTokenizer = require('./objecttokenizer/objecttokenizer.js');
var ObjectToken     = require('./objecttokenizer/objecttoken.js');
var StackManager    = require('./stackmanager.js');

var LRParser = function(options) {
  StackManager.call(this);
  this.grammar = options.grammar || [];
  this.table  = options.table || [];
  this.acceptingState = options.acceptingState || 0;
  this.tokenizer = options.tokenizer || ObjectTokenizer;
  this._beforeParse = null;
};

_.extend(LRParser, {
  getConstituents : function(popped) {
    var constituents = [];
    var i;

    for (i = 0; i < popped.length; i++) {
      if (i % 2) {
        constituents.push(popped[i]);
      }
    }
    return constituents;
  }
});

_.extend(LRParser.prototype, StackManager.prototype, {

  beforeParse : function(initializer) {
    this._beforeParse = initializer;
  },

  parse : function(object, error) {
    var transition = null;

    error = error || {};
    this._prepareToParse(object);
/*
    this._tokenizer = new this.tokenizer({
      object : object
    });
    this.initializeStack();
    this._state = 0;
    this._token = null;
*/
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

  _prepareToParse : function(object) {
    if (this._beforeParse && 
        typeof this._beforeParse === 'function') {
      this._beforeParse();
    }
    this._tokenizer = new this.tokenizer({
      object : object
    });
    this.initializeStack();
    this._state = 0;
    this._token = null;
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
    var productionNumber = transition.productionNumber;
    var production       = this.grammar.getProduction(productionNumber);
    var reduction        = this.grammar.getReduction(productionNumber);
    var lhs              = production.lhs;
    var popped           = this.popMultiple(production.rhs.length * 2);
    var previousState    = popped[0]
    var newState         = this.table[previousState][lhs].newState;
    var constituents     = null;

    this._stack.push(previousState);
    if (reduction) {
      constituents = LRParser.getConstituents(popped);
      this._stack.push(reduction.call(this, constituents));
    } else {
      this._stack.push(lhs);
    }
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
