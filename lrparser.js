var _               = require('underscore');
var ObjectTokenizer = require('./objecttokenizer/objecttokenizer.js');
var ObjectToken     = require('./objecttokenizer/objecttoken.js');
var StackManager    = require('./stackmanager.js');

var LRParser = function(options) {
  StackManager.call(this);
  this.grammar = options.grammar || [];
  this.table  = options.table || [];
};

_.extend(LRParser.prototype, StackManager.prototype, {

  parse : function(object) {
    var transition = null;

    this._tokenizer = new ObjectTokenizer(object);
    this.initializeStack();
    this._state = 0;
    this._token = null;
    while (true) {
      this._loadToken();
      transition = this._getTransition();
      if (!transition) {
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
    var previousState = this.popMultiple(production.rhs.length);
    var newState      = this.table[previousState][lhs].newState;

    this._stack.push(previousState);
    this._stack.push(lhs);
    this._state = newState;
  }

});

module.exports = LRParser;
