var _ = require('underscore');

var Traversal = function Traversal(options) {
  this._startNode = options.startNode;
  this._stack = [];
  this._visited = {};
  this._accumulator = options.accumulator;
};

_.extend(Traversal.prototype, {
  traverse : function() {
    this._stack.push(this._startNode);
    while (this._stack.length) {
      var currentNode = this._stack.pop();
      if (!this._visited[currentNode.getId()]) {
        this._visit(currentNode);
        this._visited[currentNode.getId()] = true;
      }
    }
  },

  _visit : function(node) {
    this._accumulator(node);
    Array.prototype.push.apply(this._stack, node.getNeighbors());
  }
});

module.exports = Traversal;
