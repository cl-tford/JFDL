var LRParserGenerator = require('./lrparsergenerator.js');

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
