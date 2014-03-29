var _ = require('underscore');

var A = function A(options) {
console.log("INSIDE THE A CONSTRUCTOR, GOT CALLED!\n");
  _.extend(this, options);
};

_.extend(A.prototype, {
  printSomething : function() {
console.log("Inside A.printSomething, got called.\n");
    return "Something about a, a.f is:\n" + this.f.printSomething();
  }
});

module.exports = A;
