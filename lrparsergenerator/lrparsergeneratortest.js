var LRParserGenerator = require('./lrparsergenerator.js');
var GotoTransition    = require('../transition/gototransition.js');
var ReduceTransition  = require('../transition/reducetransition.js');
var ShiftTransition   = require('../transition/shifttransition.js');
var _                 = require('underscore');
var assert            = require('chai').assert;

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

/*
var simpleProductionStrings = [
  "A -> A b",
  "A -> b"
];

var simpleLRParserGenerator = new LRParserGenerator(simpleProductionStrings);

var simpleLRParser = simpleLRParserGenerator.generate();


console.log("After generating the simple new parser, it looks like:\n", simpleLRParser);

console.log("The transition table looks like:\n", JSON.stringify(simpleLRParser.table, null, 2));
*/

describe('LRParserGenerator', function() {
  it('should generate the right parsing table for a simple grammar', function() {

    var testProductionStrings = [
      'A -> { APAIRS }',
      'APAIRS -> APAIRS APAIR',
      'APAIRS -> APAIR',
      'APAIR -> key_a A',
      'APAIR -> key_b number'
    ];

    var grammarData = _.map(testProductionStrings, function(productionString) {
      return {
        production : productionString
      };
    });

    var testLRParser = (new LRParserGenerator(grammarData)).generate();

    var table = new Array(12);

    table[0] = {
      '{' : new ShiftTransition(2),
      'A' : new GotoTransition(1)
    };

    table[1] = {
      'eof' : new ShiftTransition(3)
    };

    table[2] = {
      'key_a'  : new ShiftTransition(6),
      'key_b'  : new ShiftTransition(7),
      'APAIRS' : new GotoTransition(4),
      'APAIR'  : new GotoTransition(5)
    };

    table[3] = {};

    table[4] = {
      '}'      : new ShiftTransition(8),
      'key_a'  : new ShiftTransition(6),
      'key_b'  : new ShiftTransition(7),
      'APAIR'  : new GotoTransition(9)
    };

    table[5] = {
      '}'      : new ReduceTransition(3),
      'key_a'  : new ReduceTransition(3),
      'key_b'  : new ReduceTransition(3)
    };

    table[6] = {
      '{'      : new ShiftTransition(2),
      'A'      : new GotoTransition(10)
    };

    table[7] = {
      'number' : new ShiftTransition(11)
    };

    table[8] = {
      '}'     : new ReduceTransition(1),
      'key_a' : new ReduceTransition(1),
      'key_b' : new ReduceTransition(1),
      'eof'   : new ReduceTransition(1)
    };

    table[9] = {
      '}'     : new ReduceTransition(2),
      'key_a' : new ReduceTransition(2),
      'key_b' : new ReduceTransition(2)
    };

    table[10] = {
      '}'     : new ReduceTransition(4),
      'key_a' : new ReduceTransition(4),
      'key_b' : new ReduceTransition(4)
    };

    table[11] = {
      '}'     : new ReduceTransition(5),
      'key_a' : new ReduceTransition(5),
      'key_b' : new ReduceTransition(5)
    };

    assert.deepEqual(testLRParser.table, table);
    
  });

  it('should throw an error when given an ambiguous grammar', function() {

    var testProductionStrings = [
      'A -> a A',
      'A -> A a'
    ];

    var grammarData = _.map(testProductionStrings, function(productionString) {
      return {
        production : productionString
      };
    });

    assert.throws(function() {
      var newLRParser = (new LRParserGenerator(grammarData)).generate();
    }, /ambiguous/i);
    
  });

});
