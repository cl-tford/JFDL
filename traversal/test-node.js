var _ = require('underscore');

// Class
var Node = function Node(options) {
  this._things = options.things || [];
//  this._results = null;
  if (!(this instanceof Node)) {
    _.extend(this, Node.prototype);
  }
//  _.extend(this, options);
};

// Class Methods
_.extend(Node, {

});

// Instance Methods
_.extend(Node.prototype, {
  getThings : function() {
    return this._things.slice(0);
  },
/*
  getResults : function() {
    return this._results;
  },
*/

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
