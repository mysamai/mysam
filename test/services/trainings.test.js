const assert = require('assert');
const omit = require('lodash/omit');
const createApp = require('../../lib');

describe('trainings service', () => {
  before(function () {
    this.app = createApp();
  });

  it('creates new with nested action', function () {
    return this.app.service('trainings').create({
      text: 'something',
      action: {
        type: 'test'
      }
    }).then(training => {
      assert.equal(training.action.text, 'something', 'action text set');
      assert.ok(training.action._id, 'action populated');
      assert.equal(training.text, 'something');
    });
  });

  it.skip('training with existing action will link it even if text is different', function () {
    const action = {
      type: 'something',
      text: 'hi there',
      nested: { data: true }
    };

    return this.app.service('actions').create(action)
      .then(createdAction => {
        return this.app.service('trainings').create({
          text: 'something',
          action: {
            type: 'something',
            text: 'hi again there',
            nested: { data: true }
          }
        }).then(training =>
          assert.equal(training.action._id, createdAction._id)
        );
      });
  });

  it('adds a classification to a new training', function () {
    return this.app.service('trainings').create({
      text: 'what\'s the weather in vancouver',
      action: {
        type: 'weather',
        tags: {
          location: [ 5, 5 ]
        }
      }
    }).then(training => {
      const classification = training.classification;

      assert.deepEqual(omit(classification, 'action', 'reference'), {
        _id: '873dd3d48eed1d576a4d5b1dcacd2348',
        confidence: 1,
        extracted: { location: 'vancouver' },
        text: 'what\'s the weather in vancouver',
        tokens: [ 'what', 's', 'the', 'weather', 'in', 'vancouver' ],
        stems: [ 'what', 's', 'the', 'weather', 'in', 'vancouv' ]
      });

      const expectedAction = {
        type: 'weather',
        text: 'what\'s the weather in vancouver',
        tags: { location: [ 5, 5 ] }
      };

      assert.deepEqual(omit(classification.action, '_id'), expectedAction);
      assert.deepEqual(omit(classification.reference, '_id'), expectedAction);
    });
  });
});
