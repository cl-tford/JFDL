var LRParserGenerator = require('./lrparsergenerator.js');
/*
var productionStrings = [
  "A -> B c D g",
  "A -> B",
  "B -> d e f",
  "B -> D",
  "D -> e f B"
];

console.log("ABout to construct a new LRParserGenerator...\n");

var newLRParserGenerator = new LRParserGenerator(productionStrings);

console.log("After constructing the new LRParserGenerator, it looks like:\n", newLRParserGenerator);

console.log("About to generate a new parser.\n");

var newLRParser = newLRParserGenerator.generate();

console.log("After generating the new parser, it looks like:\n", newLRParser);

console.log("The transition table looks like:\n", JSON.stringify(newLRParser.table, null, 2));
*/
var simpleProductionStrings = [
  "A -> A b",
  "A -> b"
];

var simpleLRParserGenerator = new LRParserGenerator(simpleProductionStrings);

var simpleLRParser = simpleLRParserGenerator.generate();


console.log("After generating the simple new parser, it looks like:\n", simpleLRParser);

console.log("The transition table looks like:\n", JSON.stringify(simpleLRParser.table, null, 2));
