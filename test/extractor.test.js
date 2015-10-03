import assert from 'assert';
import Extractor from '../src/extractor';

describe('Sentence word extraction', () => {
  it('.match', function() {
    let e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver' ]);
    let tag = {
      label: 'location',
      start: 5,
      end: 5
    };

    let match = e.match(tag, ['weather', 'in', 'berlin']);
    assert.deepEqual(match, { tag: [ 'berlin' ], start: 2, matches: 2 });

    match = e.match(tag, ['weather', 'nowhere']);
    assert.deepEqual(match, { tag: null, start: -1, matches: 0 });

    match = e.match(tag, ['in', 'nowhere']);
    assert.deepEqual(match, { tag: [ 'nowhere' ], start: 1, matches: 1 });

    match = e.match(tag, ['weather', 'in', 'berlin', 'weather', 'in', 'chicago'], 2);
    assert.deepEqual(match, { tag: [ 'chicago' ], start: 5, matches: 2 });
  });

  it('.match until the end of the sentence', function() {
    let e = new Extractor([ 'say', 'hi', 'to', 'the', 'world' ]);
    let tag = {
      label: 'subject',
      start: 4,
      end: -1
    };

    let match = e.match(tag, ['say', 'hi', 'to', 'the', 'whole', 'wide', 'world']);
    assert.deepEqual(match, {
      tag: [ 'whole', 'wide', 'world' ],
      start: 4,
      matches: 4
    });
  });

  it('.extract does basic sentence word matching', () => {
    let e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver' ]);
    e.tag({
      label: 'location',
      start: 5,
      end: 5
    });

    let result = e.extract([ 'hey', 'do', 'you', 'happen', 'to',
      'know', 'the', 'weather', 'in', 'berlin' ]);
    assert.deepEqual(result, { location: ['berlin'] });

    result = e.extract([ 'what', '\'', 's', 'the', 'weather', 'in', 'chicago' ]);
    assert.deepEqual(result, { location: [ 'chicago' ] });
  });

  it('.extract takes the best match and can match nothing', function() {
    let e = new Extractor([ 'what', 'is', 'the', 'weather', 'in', 'vancouver' ]);
    e.tag({
      label: 'location',
      start: 5,
      end: 5
    });

    let result = e.extract([ 'weather', 'in', 'chicago',
      'know', 'the', 'weather', 'in', 'berlin', 'weather', 'in', 'nuremberg' ]);
    assert.deepEqual(result, { location: ['berlin'] });

    result = e.extract([ 'weather', 'nowhere' ]);
    assert.deepEqual(result, { location: null });
  });

  it('.extract multiple tag matching', function() {
    let e = new Extractor([ 'what',  'is',  'the', 'weather', 'in',
      'berlin', 'and', 'say', 'hi', 'to', 'the', 'world' ]);

    e.tag({
      label: 'location',
      start: 5,
      end: 5
    });

    e.tag({
      label: 'subject',
      start: 11,
      end: -1
    });

    let result = e.extract([ 'do', 'you', 'know', 'the', 'weather', 'in',
      'berlin', 'and', 'can', 'you', 'say',  'hi', 'to', 'the', 'wide', 'world' ]);

    assert.deepEqual(result, { location: [ 'berlin' ], subject: [ 'wide', 'world' ]});

    result = e.extract([ 'the', 'weather', 'in', 'tokyo' ]);
    assert.deepEqual(result, { location: [ 'tokyo' ], subject: null });

    result = e.extract(['say', 'hi', 'to', 'the', 'awesome', 'team']);
    assert.deepEqual(result, { location: null, subject: ['awesome', 'team'] });
  });

  it.skip('.extract multiple tag matching uses previous tags', function() {
    let e = new Extractor([ 'what', 'is', 'the', 'weather', 'in',
      'nuremberg', 'tomorrow' ]);
    e.tag({
      label: 'location',
      start: 5,
      end: 5
    });
    e.tag({
      label: 'time',
      start: 6,
      end: -1
    });
    // TODO
  });
});
