var _ = require('underscore');
var Traversal = require('./traversal.js');

var A = require('./test-a.js');
var B = require('./test-b.js');
var C = require('./test-c.js');
var E = require('./test-e.js');

console.log("ABout to start a traversal from A\n");

var traversal = new Traversal({
  startNode : A
});

var results = traversal.traverse();

console.log("The results are:\n", results);

console.log("ABout to start a traversal from B\n");

var traversal = new Traversal({
  startNode : B
});

var results = traversal.traverse();

console.log("The results are:\n", results);

console.log("ABout to start a traversal from C\n");

var traversal = new Traversal({
  startNode : C
});

var results = traversal.traverse();

console.log("The results are:\n", results);

console.log("ABout to start a traversal from E\n");

var traversal = new Traversal({
  startNode : E
});

var results = traversal.traverse();

console.log("The results are:\n", results);

