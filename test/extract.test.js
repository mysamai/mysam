const assert = require('assert');
const extract = require('../lib/extract');
const stem = require('../lib/extract/utils');
const Extractor = require('../lib/extract/extractor');
const { tokenize } = stem;

describe('mysam-extract', () => {
  it('exports high level functionality', function () {
    const e = extract.extractor('what\'s the weather in vancouver')
      .tag({ location: [5, 5] });

    assert.deepEqual(e.extract('do you know, how is the weather in san francisco'), { tags: { location: [ 8, 9 ] },
      extracted: { location: 'san francisco' }
    });
  });

  describe('utils', function () {
    it('.tokenize', function () {
      assert.deepEqual(tokenize('hello world there!'), [
        'hello', 'world', 'there'
      ]);
    });

    it('.stem', function () {
      assert.deepEqual(stem('how many days will it be'), [
        'how', 'mani', 'dai', 'will', 'it', 'be'
      ]);
      assert.deepEqual(stem(['probably', 'two', 'days']), [
        'probabl', 'two', 'dai'
      ]);
    });
  });

  describe('extractor', () => {
    describe('.matchWords', function () {
      it('.matchWords left (direction -1)', function () {
        const startIndex = 4;
        const e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver' ]);
        let words = ['weather', 'in', 'berlin'];

        assert.deepEqual(e.matchWords(words, startIndex, -1), {
          location: 2,
          matches: 2
        });

        words = [ 'do', 'you', 'know', 'the', 'weather', 'in', 'berlin' ];

        assert.deepEqual(e.matchWords(words, startIndex, -1), {
          location: 6,
          matches: 3
        });

        words = ['weather', 'in', 'berlin', 'is', 'the', 'weather', 'in', 'vancouver'];

        assert.deepEqual(e.matchWords(words, startIndex, -1, 2), {
          location: 7,
          matches: 4
        });

        words = [ 'nothing', 'here' ];

        assert.deepEqual(e.matchWords(words, startIndex, -1), {
          location: -1,
          matches: 0
        });
      });

      it('.matchWords right (direction 1)', function () {
        const e = new Extractor([ 'put', 'tomatoes', 'on', 'the', 'list' ]);
        let words = [ 'can', 'you', 'put', 'onions', 'on', 'the', 'list' ];

        assert.deepEqual(e.matchWords(words, 2, 1), {
          location: 3,
          matches: 3
        });

        assert.deepEqual(e.matchWords(words, 2, 1, 5), {
          location: -1,
          matches: 0
        });

        words = [ 'nothing', 'here' ];

        assert.deepEqual(e.matchWords(words, 2, 1), {
          location: -1,
          matches: 0
        });
      });
    });

    describe('.bestMatch', function () {
      it('.bestMatch left (direction -1)', function () {
        const startIndex = 4;
        const e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver' ]);

        let words = [ 'in', 'berlin', 'the', 'weather', 'in', 'chicago' ];

        assert.deepEqual(e.bestMatch(words, startIndex), {
          location: 5,
          matches: 3
        });

        words = [ 'nothing', 'here' ];

        assert.deepEqual(e.bestMatch(words, startIndex), {
          location: -1,
          matches: 0
        });
      });

      it('.bestMatch right (direction 1)', function () {
        const startIndex = 2;
        const e = new Extractor([ 'put', 'tomatoes', 'on', 'the', 'list' ]);

        let words = [ 'peppers', 'and', 'tomatoes', 'on', 'the', 'list' ];

        assert.deepEqual(e.bestMatch(words, startIndex, 1), {
          location: 2,
          matches: 3
        });

        words = [ 'onions', 'on', 'the', 'peppers', 'on', 'the', 'list' ];

        assert.deepEqual(e.bestMatch(words, startIndex, 1), {
          location: 3,
          matches: 3
        });

        words = [ 'nothing', 'here' ];

        assert.deepEqual(e.bestMatch(words, startIndex), {
          location: -1,
          matches: 0
        });
      });
    });

    describe('.getTag', function () {
      it('extracts end-of-sentence tag', function () {
        const tag = {
          label: 'location',
          bounds: [ 5, 5 ]
        };

        const e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver' ]);

        let words = ['do', 'you', 'know', 'the', 'weather', 'in', 'berlin'];

        assert.deepEqual(e.getTag(tag, words), {
          label: 'location',
          bounds: [ 6, 6 ]
        });

        words = ['what', 'is', 'the', 'weather', 'in', 'san', 'francisco'];

        assert.deepEqual(e.getTag(tag, words), {
          label: 'location',
          bounds: [ 5, 6 ]
        });
      });

      it('extracts beginning-of-sentence tag', function () {
        const tag = {
          label: 'items',
          bounds: [ 0, 1 ]
        };

        const e = new Extractor([ 'tomatoes', 'on', 'the', 'list' ]);

        let words = [ 'onions', 'and', 'apples', 'on', 'the', 'list' ];

        assert.deepEqual(e.getTag(tag, words), {
          label: 'items',
          bounds: [ 0, 2 ]
        });
      });

      it('extracts middle-of-sentence tag', function () {
        const tag = {
          label: 'items',
          bounds: [ 3, 3 ]
        };

        const e = new Extractor([ 'can', 'you', 'put', 'tomatoes', 'on', 'the', 'list' ]);

        let words = [ 'hey', 'can', 'you', 'put', 'potatoes', 'and', 'onions', 'on', 'the', 'list' ];

        assert.deepEqual(e.getTag(tag, words), {
          label: 'items',
          bounds: [ 4, 6 ]
        });
      });

      it('works with extracting nothing', function () {
        const tag = {
          label: 'location',
          bounds: [ 5, 5 ]
        };

        const e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver' ]);

        assert.deepEqual(e.getTag(tag, ['nothing', 'here']), {
          label: 'location',
          bounds: null
        });
      });
    });

    describe('getTags', function () {
      it('getting a simple tag', function () {
        const e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver' ]);

        e.tag({ location: [ 5, 5 ] });

        assert.deepEqual(e.getTags([
          'hey', 'do', 'you', 'know', 'the', 'weather', 'in', 'san', 'francisco'
        ]), { location: [ 7, 8 ] });
      });

      it('getting multiple succeeding tags', function () {
        const e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver', 'tomorrow' ]);

        e.tag({
          location: [ 5, 5 ],
          time: [ 6, 6 ]
        });

        let words = [ 'hey', 'do', 'you', 'know', 'the', 'weather', 'in', 'berlin' ];

        assert.deepEqual(e.getTags(words), {
          location: [ 7, 7 ],
          time: null
        });

        words = [ 'what', 'is', 'the', 'weather', 'in', 'berlin', 'on', 'the', 'weekend' ];

        assert.deepEqual(e.getTags(words), {
          location: [ 5, 5 ],
          time: [ 6, 8 ]
        });

        words = [ 'what', 'is', 'the', 'weather', 'in', 'berlin', 'in', 'two', 'days' ];

        assert.deepEqual(e.getTags(words), {
          location: [ 5, 5 ],
          time: [ 6, 8 ]
        });
      });

      it('shopping list tags', function () {
        const e = new Extractor([
          'can', 'you', 'put', 'tomatoes', 'on', 'the', 'shopping', 'list'
        ]);

        e.tag({
          items: [ 3, 3 ],
          listname: [ 6, 6 ]
        });

        let words = [
          'put', 'onions', 'and', 'peppers', 'on', 'the', 'to', 'do', 'list'
        ];

        assert.deepEqual(e.getTags(words), {
          items: [ 1, 3 ],
          listname: [ 6, 7 ]
        });

        words = [ 'can', 'you', 'say', 'something', 'on', 'the', 'list' ];

        assert.deepEqual(e.getTags(words), {
          items: null,
          listname: null
        });
      });

      it('phone texting tag', function () {
        const e = new Extractor([
          'can', 'you', 'text', 'larissa', 'that', 'i', 'am', 'on', 'my', 'way'
        ]);

        e.tag({
          to: [ 3, 3 ],
          text: [ 5, 9 ]
        });

        let words = [
          'can', 'you', 'please', 'text', 'eric', 'that', 'i', 'will', 'be', 'a', 'little', 'late'
        ];

        assert.deepEqual(e.getTags(words), {
          to: [ 4, 4 ],
          text: [ 6, 11 ]
        });
      });
    });

    it('.extract and high level usage', function () {
      let e = new Extractor('what\'s the weather in vancouver');

      e.tag({ location: [5, 5] });

      assert.deepEqual(e.extract('do you know, how is the weather in san francisco'), { tags: { location: [ 8, 9 ] },
        extracted: { location: 'san francisco' }
      });
    });
  });
});
