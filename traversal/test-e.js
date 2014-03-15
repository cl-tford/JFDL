var _ = require('underscore');
//var Module = require('./module.js');
var Module = require('./module2.js');
var Node = require('./test-node.js');


// Class
var E = function E(options) {
  _.extend(this, options);
};

Module.call(E, {
  id : 'Test-E',
  dependencies : []
});

Node.call(E, {
  things : ['eab']
});

module.exports = E;
