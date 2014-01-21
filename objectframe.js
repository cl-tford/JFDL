var _ = require('underscore');
var ObjectToken = require('./objecttoken.js');

var ObjectFrame = function(object) {
  this._object = object;
  this._keys = _.keys(object);
  this._position = 0;
};

_.extend(ObjectFrame.prototype, {
  getNextToken : function() {
    var nextToken = null;
    var key = null;

    if (this._position >= 2 * this._keys.length) {
      return null;
    }
    nextToken = this._getTokenAtPosition();
    this._position++;
    return nextToken;
  },

  _getTokenAtPosition : function() {
    var key   = null;

    if (this._position % 2) { // Return a value.
      key = this._keys[(this._position - 1) / 2];
      return new ObjectToken({
        type : 'value',
        data : this._object[key]
      });
    } 
    key = this._keys[this._position / 2];
    return new ObjectToken({
      type : 'key',
      data : key
    });
  }
});

module.exports = ObjectFrame;
