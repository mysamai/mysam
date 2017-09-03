const assert = require('assert');
const omit = require('lodash/omit');
const createApp = require('../../../lib');

describe('classification service', () => {
  before(function (done) {
    const app = createApp();

    this.app = app;
    this.trainings = app.service('trainings');
    this.classify = app.service('classify');

    Promise.all([
      this.trainings.create({
        text: 'what\'s the weather in vancouver',
        action: {
          type: 'weather',
          tags: {
            location: [ 5, 5 ]
          }
        }
      }),
      this.trainings.create({
        text: 'what\'s the weather in vancouver on the weekend',
        action: {
          type: 'weather',
          tags: {
            location: [ 5, 5 ],
            time: [ 6, 8 ]
          }
        }
      }),
      this.trainings.create({
        text: 'what\'s the weather in vancouver in three days',
        action: {
          type: 'weather',
          tags: {
            location: [ 5, 5 ],
            time: [ 6, 8 ]
          }
        }
      }),
      this.trainings.create({
        text: 'say hi to someone',
        action: {
          type: 'greet',
          tags: {
            reply: [ 3, 3 ]
          }
        }
      }),
      this.trainings.create({
        text: 'this is my friend Eric',
        action: {
          type: 'greet',
          tags: {
            reply: [ 4, 4 ]
          }
        }
      }),
      this.trainings.create({
        text: 'can I watch a movie',
        action: {
          type: 'movie',
          data: { mode: 'play' }
        }
      })
    ]).catch(done);

    this.classify.once('trained', () => done());
  });

  describe('classify weather', function () {
    it('simple weather', function () {
      const text = 'what\'s the weather in san francisco';

      return this.classify.create({ text }).then(classification => {
        assert.ok(classification.confidence > 0.5);
        assert.deepEqual(omit(classification.action, '_id'), {
          type: 'weather',
          text,
          tags: { location: [ 5, 6 ] }
        });
        assert.equal(classification.extracted.location, 'san francisco');
      });
    });

    it('weekend weather', function () {
      const text = 'how is the weather in berlin on the weekend';

      return this.classify.create({ text }).then(classification => {
        assert.deepEqual(omit(classification.action, '_id'), {
          type: 'weather',
          text,
          tags: {
            location: [ 5, 5 ],
            time: [ 6, 8 ]
          }
        });
        assert.deepEqual(classification.extracted, {
          location: 'berlin',
          time: 'on the weekend'
        });
      });
    });

    it('in two days', function () {
      const text = 'what\'s the weather in chicago in two days';

      return this.classify.create({ text }).then(classification => {
        assert.deepEqual(omit(classification.action, '_id'), {
          type: 'weather',
          text,
          tags: {
            location: [ 5, 5 ],
            time: [ 6, 8 ]
          }
        });
        assert.deepEqual(classification.extracted, {
          location: 'chicago',
          time: 'in two days'
        });
      });
    });
  });

  describe('say hi', function () {
    it('say hi to david and the cat', function () {
      const text = 'Can you say hi to david and the cat';

      return this.classify.create({ text }).then(classification => {
        assert.ok(classification.confidence > 0.5);
        assert.deepEqual(omit(classification.action, '_id'), {
          type: 'greet',
          text: 'can you say hi to david and the cat',
          tags: { reply: [ 5, 8 ] }
        });
        assert.equal(classification.extracted.reply, 'david and the cat');
      });
    });

    it('this is my friend dave the dude', function () {
      const text = 'this is my friend dave the dude';

      return this.classify.create({ text }).then(classification => {
        assert.ok(classification.confidence > 0.5);
        assert.deepEqual(omit(classification.action, '_id'), {
          type: 'greet',
          text: 'this is my friend dave the dude',
          tags: { reply: [ 4, 6 ] }
        });
        assert.equal(classification.extracted.reply, 'dave the dude');
      });
    });
  });

  describe('classify movie', function () {
    it('watch a movie', function () {
      const text = 'I want to watch a movie';

      return this.classify.create({ text }).then(classification => {
        assert.ok(classification.confidence > 0.5);
        assert.deepEqual(omit(classification.action, '_id'), {
          type: 'movie',
          data: { mode: 'play' },
          text: 'i want to watch a movie',
          tags: {}
        });
      });
    });
  });
});
