var pos = require('pos');
var natural = require('natural');
var stemmer = natural.PorterStemmer;

function match(baseline, words, index, start, backwards) {
  var word = baseline[index];
  var currentIndex = words.indexOf(word, start);
  var startIndex = currentIndex;
  var coverage = 0;

  if(currentIndex !== -1) {
    var offset = currentIndex - index;
    var matches = 0;

    while(words[currentIndex] !== undefined &&
        words[currentIndex] === baseline[currentIndex - offset]) {
      currentIndex = currentIndex + (backwards ? -1 : 1);
      matches++;
    }
  }

  if(backwards) {
    coverage = matches / (index + 1);
  } else {
    coverage = matches / (baseline.length - index);
  }

  return {
    coverage: coverage,
    index: startIndex
  }
}

var baseline = new pos.Lexer().lex('What is the weather in Vancouver');
var words = new pos.Lexer().lex('Do you know what the weather in berlin is');
var result = match(baseline, words, 4, 0, true);

console.log(result);
console.log(words[result.index + 1]);

//result = match(baseline, words, 5, 1, true);
//
//console.log(result);
//console.log(words[result.index + 1]);

//function Samirizer(words, tags) {
//  this.words = words;
//  this.tags = tags;
//}
//
//Samirizer.prototype.extract = function(target) {
//  var baseline = this.words;
//
//  this.tags.forEach(function(tag) {
//    var start = baseline[tag.start - 1];
//    var startIndex = target.indexOf(start);
//    var currentIndex = startIndex;
//
//    if(startIndex !== -1) {
//      var matches = 1;
//      while(currentIndex !== -1) {
//        currentIndex--;
//
//      }
//    }
//
//    //edges = {
//    //  prev: baseline[tag.start - 1],
//    //  after: tag.end ? baseline[tag.end + 1] : null
//    //};
//    //
//    //index = {
//    //  prev: words.indexOf(edges.prev),
//    //  after: edges.after && words.indexOf(edges.after)
//    //};
//    //
//    //var prev = baseline[tag.start - 1];
//    //var currentIndex = words.indexOf(prev);
//    //var found = currentIndex;
//    //while(currentIndex !== -1) {
//    //
//    //}
//  });
//}
//
//var samirizer = function() {
//  tag: function(words, tags) {
//    // [{ position: 0, label: 'location' }]
//  }
//};
//
//var words = new pos.Lexer().lex(input);
//
//
//var taggedWords = new pos.Tagger().tag(words);
//var pos = taggedWords.map(function(touple) { return touple[1] });
//
//console.log(words, pos);
//console.log(stemmer.tokenizeAndStem(input));
//
//var stems = taggedWords.map(function(cur) {
//  return stemmer.stem(cur[0]);
//});
//
//console.log(stems);
