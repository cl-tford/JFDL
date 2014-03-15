var _ = require('underscore');

var Traversal = function Traversal(options) {
  this._startNode = options.startNode;
  this._stack = [];
  this._visited = {};
//  this._accumulator = options.accumulator;
  this._accumulator = options.accumulator || this._startNode.accumulator();
};

_.extend(Traversal.prototype, {
  traverse : function() {
    this._stack.push(this._startNode);
    while (this._stack.length) {
      var node = this._stack.pop();
      if (!this._visited[node.getId()]) {
        this._visit(node);
        this._accumulator.accumulate(node);
      }
    }
    return this._accumulator.getResults();
  },

  _visit : function(node) {
    Array.prototype.push.apply(this._stack, node.getNeighbors());
    this._visited[node.getId()] = true;
  },

  _getResults : function() {
    return this._accumulator.getResults();
  }
});

module.exports = Traversal;
