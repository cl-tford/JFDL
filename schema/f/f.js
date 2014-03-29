var _ = require('underscore');

var F = function F(options) {
console.log("INSIDE THE F CONSTRUCTOR, GOT CALLED!\n");
  _.extend(this, options);
};

_.extend(F.prototype, {
  printSomething : function() {
    var basic = "something about f\n";
    
    if (this.a) {
      basic = basic + this.a.printSomething();
    }
    return basic;
    
  }
});

module.exports = F;
