var _ = require('underscore');
var TestNode = require('./testnode.js');

// Class
var E = function E(options) {
  _.extend(this, options);
};

TestNode.call(E, {
  id : 'Test-E',
  things : ['eab'],
  dependencies : []
});

_.extend(E, TestNode.prototype, {

});

module.exports = E;
