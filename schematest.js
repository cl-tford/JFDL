var Schema = require('./schema.js');
var _      = require('underscore');

// Class
var A = function A(options) {
  _.extend(this, options);
};

// Class Members
_.extend(A, {
  syntax : {
    "b" : {
      "c" : "string",
      "d" : "number"
    },
    "e" : "boolean",
    "a" : "A"
  },
  startSymbol : 'A'
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

console.log("About to load an object:\n");

schemaA.load({
  "b" : {
    "c" : "string",
    "d" : 2
  },
  "e" : true,
  "a" : {
    "b" : {
      "c" : 'hello'
    }
  }
}, function(err, testObject1) {
  if (err) {
    return console.log("Error loading testObject1:\n", err);
  }
  console.log("The result of loading testObject1 is:\n", testObject1);
  console.log("The result of printing something on testObject1 is:\n", testObject1.printSomething());
  
  schemaA.load({
    "e" : false,
    "b" : {
      "c" : "string",
      "d" : 2
    }
  }, function(err, testObject2) {
    if (err) {
      return console.log("Error loading testObject2:\n", err);
    }
    console.log("The result of loading testObject2 is:\n", testObject2);
    console.log("The result of printing something on testObject2 is:\n", testObject2.printSomething());
  });
});
  
module.exports = schemaA;
