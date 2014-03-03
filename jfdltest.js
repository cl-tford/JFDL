var LRParserGenerator = require('./lrparsergenerator/lrparsergenerator.js');

var newLRParserGenerator = new LRParserGenerator([
//  'PHI -> A eof',
  'A -> { APAIRS }',
  'APAIRS -> APAIRS APAIR',
  'APAIRS -> APAIR',
  'APAIR -> key_a A',
  'APAIR -> key_b number'
]);

var lrparser = newLRParserGenerator.generate();

console.log("Inside /Users/terranceford/JFDL/jfdltest.js, after generating the new lrparser, it looks like:\n", lrparser);

var testObject = {
  a : {
    b : 2
  },
  b : 1
};

var result = lrparser.parse(testObject);

console.log("The result is:\n", result);
