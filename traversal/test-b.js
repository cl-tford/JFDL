var _ = require('underscore');
var Module = require('./module.js');
var Node   = require('./test-node.js');

// Class
var B = function B(options) {
  _.extend(this, options);
};

//Module.call(B, {
Module.mixin(B, {
  id : 'Test-B',
  dependencies : ['Test-C', 'Test-E']
});

//Node.call(B, {
Node.mixin(B, {
  things : ['b1']
});

module.exports = B;
