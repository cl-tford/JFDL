var _ = require('underscore');

var Mixable = function Mixable() {

};

_.extend(Mixable, {
  mixin : function(target, options) {
    this.call(target, options);
    _.extend(target, this.prototype);
  }
});

module.exports = Mixable;
