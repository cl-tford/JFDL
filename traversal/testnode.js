var _ = require('underscore');
var Module = require('./module.js');

// Class
var TestNode = function TestNode(options) {
  Module.call(this, options);
  this._things = options.things || [];
};

// Class Methods
_.extend(TestNode, Module, {

});

// Instance Methods
_.extend(TestNode.prototype, Module.prototype, {
  getThings : function() {
    return this._things.slice(0);
  },

  getNeighbors : function() {
    var neighbors = [];
    
    _.each(this.getDependencies(), function(dependency) {
      var module = Module.getById(dependency);

      neighbors.push(module);
    });
    return neighbors;
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

module.exports = TestNode;
