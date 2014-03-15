var _ = require('underscore');
var Traversal = require('./traversal');

var TestNode = function TestNode(options) {
  this._things = options.things || [];
  this._dependencies = options.dependencies || [];
  this._id = this._recordId(options);
  this._results = null;
};

_.extend(TestNode, {
  _nodesById : {},
  storeId : function(id, node) {
    this._nodesById[id] = node;
  },
  getNode : function(id) {
    return this._nodesById[id];
  }
});


_.extend(TestNode.prototype, {
  getId : function() {
    return this._id;
  },
  getThings : function() {
    return this._things.slice(0);
  },

  getResults : function() {
    return this._results;
  },

  getNeighbors : function() {
    return _.map(this._dependencies, function(dependency) {
      return TestNode.getNode(dependency);
    });
  },

  load : function() {
    var traversal = new Traversal({
      startNode : this,
      accumulator : this._accumulator()
    });
    this._results = null;
    traversal.traverse();
    return this.getResults();
  },

  _recordId : function(options) {
    var id = options.id;
    TestNode.storeId(id, this);
    return id;
  },

  _accumulator : function() {
    var self = this;

    return function accumulate(testNode) {
      if (!self._results) {
        self._results = [];
      }
      Array.prototype.push.apply(
        self._results, 
        testNode.getThings()
      );
    };
  }
});

var nodeA = new TestNode({
  things : ['thiga1', 'athing2'],
  dependencies : ['B', 'C'],
  id : 'A'
});

var nodeB = new TestNode({
  things : ['b1'],
  dependencies : ['C', 'E'],
  id : 'B'
});

var nodeC = new TestNode({
  things : ['c2'],
  dependencies : ['A'],
  id : 'C'
});

var nodeE = new TestNode({
  things : ['eab'],
  id : 'E'
});


console.log("About to traverse from A:\n");
var resultsA = nodeA.load();
console.log("The result of loading nodeA was:\n", resultsA);

var resultsB = nodeB.load();
console.log("The result of loading nodeB was:\n", resultsB);

var resultsC = nodeC.load();
console.log("The result of loading nodeB was:\n", resultsC);

var resultsE = nodeE.load();
console.log("The result of loading nodeE was:\n", resultsE);
