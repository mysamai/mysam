import _ from 'lodash';

export default class Extractor {
  constructor(baseline, tags) {
    this.baseline = baseline;
    this.tags = tags || [];
  }

  tag(tag) {
    const tags = Array.isArray(tag) ? tag : [tag];
    this.tags.push.apply(this.tags, tags);
  }

  extract(words) {
    let result = {};

    this.tags.forEach(tag => {
      let matches = [];
      let currentMatch = null;

      do {
        let startIndex = currentMatch ? currentMatch.start : 0;
        currentMatch = this.match(tag, words, startIndex);

        if(currentMatch.tag !== null && currentMatch.matches > 1) {
          matches.push(currentMatch);
        }
      } while(currentMatch.start > 0);

      let bestMatch = _.max(matches, function(match) {
        return match.matches;
      });

      result[tag.label] = matches.length ? bestMatch.tag : null;
    });

    return result;
  }

  match(tag, words, startIndex) {
    let word = this.baseline[tag.start - 1];
    let index = words.indexOf(word, startIndex || 0);
    let offset = index - tag.start + 1;
    let start = index + 1;
    let matches = 0;

    while(index !== -1 && typeof words[index] !== 'undefined' &&
        typeof this.baseline[index - offset] !== 'undefined' &&
        words[index] === this.baseline[index - offset]) {
      matches++;
      index--;
    }

    if(matches === 0) {
      return { tag: null, start: -1, matches };
    }

    let endIndex = tag.end === -1 ? words.length :
      start + (tag.start - tag.end);

    return { tag: words.slice(start, endIndex + 1), start, matches };
  }
}
