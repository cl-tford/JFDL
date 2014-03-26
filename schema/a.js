var Schema = require('./schema.js');
var _      = require('underscore');

// Class
var A = function A(options) {
console.log("Constructing a new A object!!!111\n");
  _.extend(this, options);
};

// Class Members
_.extend(A, {
  id : 'A',
  syntax : {
    "b" : {
      "c" : "string",
      "d" : "number"
    },
    "a" : "A",
    "e" : "boolean",
    "f" : "F"
  },
  dependencies : ['F']
});

// Instance Methods
_.extend(A.prototype, {
  printSomething : function() {
    if (this.e) {
      return this.b.c;
    } else {
      return this.b.d;
    }
  }
});

var schemaA = new Schema(A);
console.log("Inside a.js, the export is:\n", schemaA);
module.exports = schemaA;
