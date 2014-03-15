var _ = require('underscore');
//var Module = require('./module.js');
var Module = require('./module2.js');
var Node   = require('./test-node.js');

// Class
var B = function B(options) {
  _.extend(this, options);
};

Module.call(B, {
  id : 'Test-B',
  dependencies : ['Test-C', 'Test-E']
});

Node.call(B, {
  things : ['b1']
});

module.exports = B;
