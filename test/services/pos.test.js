import assert from 'assert';
import app from '../../lib/app';

const pos = app.service('pos');

describe('part of speech tagging service', () => {
  it('basic tagging', done => {
    let text = 'What\'s the weather in Berlin';

    pos.create({ text }, {}, (error, data) => {
      assert.deepEqual(data, {
        text,
        tokens: ['What', '\'', 's', 'the', 'weather', 'in', 'Berlin'],
        tags: ['WP', '"', 'PRP', 'DT', 'NN', 'IN', 'NNP']
      });

      done(error);
    });
  });
});
