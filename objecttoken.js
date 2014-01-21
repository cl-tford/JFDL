var _ = require('underscore');

var ObjectToken = function(options) {
  this._type = options.type;
  this._data = options.data;
};

_.extend(ObjectToken.prototype, {
  isKey : function() {
    return (this._type == 'key');
  },
  isValue : function() {
    return !this.isKey();
  },
  isAtomicValue : function() {
    if (_.isNumber(this._data) ||
        _.isString(this._data) ||
        _.isBoolean(this._data)) {
      
      return true;
    }
    return false;
  }
});

module.exports = ObjectToken;
