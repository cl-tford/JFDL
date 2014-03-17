var Schema = require('./schema.js');
var _      = require('underscore');
var A      = require('./a.js');

/*
// Class
var A = function A(options) {
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

*/
console.log("About to load an object:\n");

A.load({
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
  
  A.load({
    "e" : 'false',
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

  A.load({
    "e" : false,
    "b" : {
      "c" : "string",
      "d" : 2
    },
    "f" : {
      "bb" : {
        "cc" : 'holy',
        "dd" : 667
      }
    }
  }, function(err, testObject3) {
    if (err) {
      return console.log("Error loading testObject2:\n", err);
    }
    console.log("The result of loading testObject2 is:\n", testObject3);
    console.log("The result of printing something on testObject3 is:\n", testObject3.printSomething());
    console.log("The result of printing something on testObject3.f is:\n", testObject3.f.printSomething());
  });

});
