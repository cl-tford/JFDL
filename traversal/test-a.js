var _ = require('underscore');
var TestNode = require('./testnode.js');

// Class
var A = function A(options) {
  _.extend(this, options);
};

// Class Members and Methods.
TestNode.call(A, {
  id           : 'Test-A',
  things       : ['thinga1', 'athig1', 'a1tign'],
  dependencies : ['Test-B', 'Test-C']
});

_.extend(A, TestNode.prototype, {

});

module.exports = A;
