var _ = require('underscore');
var Module = require('./module.js');
var Node = require('./test-node.js');

// Class
var A = function A(options) {
  _.extend(this, options);
};

Module.mixin(A, {
  id : 'Test-A',
  dependencies : ['Test-B', 'Test-C']
});

Node.mixin(A, {
  things : ['thiga1', 'athing2']
});

module.exports = A;
