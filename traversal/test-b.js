var _ = require('underscore');
var TestNode = require('./testnode.js');

// Class
var B = function B(options) {
  _.extend(this, options);
};

TestNode.call(B, {
  id           : 'Test-B',
  things       : ['b1'],
  dependencies : ['Test-C', 'Test-E']
});

_.extend(B, TestNode.prototype, {
 
});

module.exports = B;
