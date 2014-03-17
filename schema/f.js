var Schema = require('./schema.js');
var _      = require('underscore');


// Class
var F = function F(options) {
  _.extend(this, options);
};



// Class Members
_.extend(F, {
  id : 'F',
  syntax : {
    "bb" : {
      "cc" : "string",
      "dd" : "number"
    },
    "ee" : "boolean",
    "f" : "F"
  },
  dependencies : []
});

// Instance Methods
_.extend(F.prototype, {
  printSomething : function() {
    return "something about f\n";
  }
});

var schemaF = new Schema(F);

module.exports = schemaF;
