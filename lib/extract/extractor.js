const each = require('lodash/each');
const isEqual = require('lodash/isEqual');
const maxBy = require('lodash/maxBy');
const stem = require('./utils');
const { tokenize } = stem;

class Extractor {
  constructor (baseline, tags = []) {
    this.baseline = stem(baseline);
    this.tags = tags;
  }

  tag (tags) {
    each(tags, (bounds, label) => this.tags.push({ label, bounds }));

    // Make sure that tags are ordered by their beginning location
    this.tags.sort((first, second) => first.bounds[0] - second.bounds[0]);

    return this;
  }

  extract (sentence) {
    const tokens = tokenize(sentence);
    const tags = this.getTags(stem(tokens));
    const extracted = {};

    each(tags, (bounds, label) => {
      extracted[label] = bounds
        ? tokens.slice(bounds[0], bounds[1] + 1).join(' ') : null;
    });

    return { tags, extracted };
  }

  getTags (words) {
    let currentWords = words;
    let startIndex = 0;
    let tags = this.tags.map(tag => {
      // Find the words in the baseline that this tag matches
      const [ baselineStart, baselineEnd ] = tag.bounds;
      const baselineWords = this.baseline.slice(baselineStart, baselineEnd + 1);

      const result = this.getTag(tag, currentWords, startIndex);

      if (result.bounds) {
        const [ tagStart, tagEnd ] = result.bounds;
        const copy = currentWords.slice(0);

        // We need to replace the match with the baseline words so that
        // suceeding tags still match. Currently we can only do that
        // if the tag and the baseline tag have the same length since
        // indices would get messed up otherwise
        if (baselineWords.length === tagEnd - tagStart + 1) {
          copy.splice(tagStart, (tagEnd + 1) - tagStart, ...baselineWords);

          currentWords = copy;
        }

        startIndex = result.bounds[1];
      }

      return result;
    });

    const result = {};

    tags.forEach(tag => (result[tag.label] = tag.bounds));

    return result;
  }

  getTag (tag, words, startIndex = 0) {
    const label = tag.label;
    const [ start, end ] = tag.bounds;
    const length = start - end;

    let bounds = null;

    // If baseline start at 0, we'll also start at the beginning
    const tagStart = start === 0 ? 0
      // Otherwise use the best match (matching to the left)
      : this.bestMatch(words, start - 1, -1, startIndex).location;

    if (tagStart === -1) {
      return { label, bounds };
    }

    const tagEnd = end === this.baseline.length - 1
      // If baseline tag ends at the end of sentence use the end of
      // the text to check
      ? words.length - 1
      // Otherwise use the best match (matching to the right)
      : this.bestMatch(words, start + 1, 1, tagStart).location;

    if (tagEnd === -1) {
      bounds = [ tagStart, tagStart + length ];
    } else if (tagEnd >= tagStart) {
      bounds = [ tagStart, tagEnd ];
    }

    return { label, bounds };
  }

  bestMatch (words, baselineIndex, direction, startIndex = 0) {
    const matchList = [];

    let currentMatch, previousMatch;

    do {
      previousMatch = currentMatch;
      currentMatch = this.matchWords(words, baselineIndex, direction, startIndex);
      // Update the startIndex to find the next match
      startIndex = currentMatch.location + currentMatch.matches;
      matchList.push(currentMatch);
    } while (
      // no more matches
      currentMatch.location !== -1 &&
      // break condition to avoid possible infinite loops
      !isEqual(currentMatch, previousMatch)
    );

    return maxBy(matchList, match => match.matches);
  }

  matchWords (words, baselineIndex, direction = -1, startIndex = 0) {
    // The baseline word
    let word = this.baseline[baselineIndex];
    // The index of the same word in the text to check
    let index = words.indexOf(word, startIndex);
    // Offset between baseline and the text to check
    let offset = index - baselineIndex;
    // the initial index is the location we return
    let location = index;
    // The number of matches
    let matches = 0;

    if (location !== -1) {
      // Depending on if we are going to the left or the right
      // the location needs to be adjusted accordingly
      location = index + (-1 * direction);
    }

    // Now add up all matches between the baseline text and the text to check
    while (index !== -1 && typeof words[index] !== 'undefined' &&
        typeof this.baseline[index - offset] !== 'undefined' &&
        words[index] === this.baseline[index - offset]) {
      matches++;
      index = index + direction;
    }

    return { location, matches };
  }
}

module.exports = Extractor;
