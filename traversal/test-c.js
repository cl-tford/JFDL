var _ = require('underscore');
var TestNode = require('./testnode.js');

// Class
var C = function C(options) {
  _.extend(this, options);
};

TestNode.call(C, {
  id           : 'Test-C',
  dependencies : ['Test-A'],
  things       : ['c2']
});

_.extend(C, TestNode.prototype, {

});

module.exports = C;
