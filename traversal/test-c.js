var _ = require('underscore');
//var Module = require('./module.js');
var Module = require('./module2.js');
var Node = require('./test-node.js');

// Class
var C = function C(options) {
  _.extend(this, options);
};

Module.call(C, {
  id : 'Test-C',
  dependencies : ['Test-A']
});

Node.call(C, {
  things : ['c2']
});

module.exports = C;
