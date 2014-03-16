var _ = require('underscore');

// Class
var Node = function Node(options) {
  this._id = options.id;
};

// Class Methods
_.extend(Node, {

});

// Instance Methods
_.extend(Node.prototype, {
  getId : function() {
    return this._id;
  },
  getNeighbors : function() {
console.log("Inside getNeighbors, the id is:\n", this.getId());
    throw new Error("getNeighbors not implemented.");
  },
  accumulator : function() {
    throw new Error("accumulator unimplemented.");
  }
});

module.exports = Node;
