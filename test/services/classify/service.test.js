const assert = require('assert');
const { EventEmitter } = require('events');
const Service = require('../../../lib/services/classify/classify.class');

describe('classify service class', function () {
  it('initializes and classifies actions', function (done) {
    const classify = new Service();

    Object.assign(classify, EventEmitter.prototype);

    classify.addTraining({
      action: { _id: 'weather' },
      text: 'what is the weather like'
    });

    classify.addTraining({
      action: { _id: 'weather' },
      text: 'can you tell me the weather'
    });

    classify.addTraining({
      action: { _id: 'todo' },
      text: 'I have to do dishes'
    });

    classify.addTraining({
      action: { _id: 'music' },
      text: 'Play a song'
    });

    classify.once('trained', () => {
      let text = 'How\'s the weather?';

      Promise.all([
        classify.create({ text }).then(result => {
          assert.equal(result.text, text);
          assert.equal(result.action, 'weather');
          assert.ok(result.confidence > 0.5);
        }),
        classify.create({
          text: 'Play some stuff'
        }).then(result => {
          assert.equal(result.action, 'music');
          assert.ok(result.confidence > 0.5);
        })
      ]).then(() => done()).catch(done);
    });
  });

  it('can remove actions', function (done) {
    const classify = new Service();
    const musicAction = {
      action: { _id: 'music' },
      text: 'Play a song'
    };

    Object.assign(classify, EventEmitter.prototype);

    classify.addTraining({
      action: { _id: 'weather' },
      text: 'what is the weather like'
    });

    classify.addTraining({
      action: { _id: 'todo' },
      text: 'I have to do dishes'
    });

    classify.addTraining(musicAction);

    classify.once('trained', () => {
      const text = 'Play some stuff';

      classify.create({ text }).then(result => {
        assert.equal(result.action, 'music');
        assert.ok(result.confidence > 0.6);
      }).then(() => {
        classify.removeTraining(musicAction);

        classify.once('trained', () => {
          classify.create({ text }).then(result => {
            assert.ok(result.confidence < 0.6);
            done();
          }).catch(done);
        });
      }).catch(done);
    });
  });
});
