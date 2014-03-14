var SyntaxParser = require('./syntaxparser.js');

var A = {
  "b" : {
    "c" : "string",
    "d" : "number"
  },
  "e" : "boolean"
};

var syntaxParser = new SyntaxParser({
  startSymbol : 'A'
});

syntaxParser.parse(A, function(err, result) {
  if (err) {
    return console.log("Got errors:\n", err);
  }
  console.log("Got result:\n", result);
  console.log("The productions of the result are:\n", result.grammar._productions);
  
  var testObject = {
  "b" : {
    "c" : "string",
    "d" : 2
  },
  "e" : true
};
  console.log("About to validate the test object.\n");
  var testObjectErrors = {};
  var validationResult = result.parse(testObject, testObjectErrors);
  console.log("After parsing the testObject, the validation result is:\n", validationResult);
  console.log("After parsing the testObject, the errors are:\n", testObjectErrors);

});

