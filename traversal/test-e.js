var _ = require('underscore');
var Module = require('./module.js');
var Node = require('./test-node.js');


// Class
var E = function E(options) {
  _.extend(this, options);
};

//Module.call(E, {
Module.mixin(E, {
  id : 'Test-E',
  dependencies : []
});

//Node.call(E, {
Node.mixin(E, {
  things : ['eab']
});

module.exports = E;
