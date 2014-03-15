var _ = require('underscore');
var Module = require('./module.js');
var Node = require('./test-node.js');

// Class
var C = function C(options) {
  _.extend(this, options);
};

//Module.call(C, {
Module.mixin(C, {
  id : 'Test-C',
  dependencies : ['Test-A']
});

//Node.call(C, {
Node.mixin(C, {
  things : ['c2']
});

module.exports = C;
