var _ = require('underscore');
var Mixable = require('./mixable.js');

// Class
var Node = function Node(options) {
  this._things = options.things || [];
};

// Class Methods
_.extend(Node, Mixable, {

});

// Instance Methods
_.extend(Node.prototype, {
  getThings : function() {
    return this._things.slice(0);
  },

  accumulator : function() {
    var self = this;
    var results = [];

    return {
      accumulate : function(node) {
        Array.prototype.push.apply(results, node.getThings());
      },
      
      getResults : function() {
        return results;
      }
    };
  }
});

module.exports = Node;
