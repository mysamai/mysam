import _ from 'lodash';
import assert from 'assert';
import app from '../../src/app';

const classify = app.service('classify');

describe('BrainJS classifier', () => {
  const actions = app.service('actions');
  const { find, get, create } = actions;
  const fixture = [{
    _id: 0,
    text: 'can you hear me',
    action: {
      type: 'reply',
      text: 'Loud and clear'
    }
  }, {
    _id: 1,
    text: 'say hi to david',
    tags: [{
      label: 'subject',
      start: 3,
      end: -1
    }],
    action: {
      type: 'reply',
      text: 'Hi {{subject}}'
    }
  }, {
    _id: 2,
    text: 'the meaning of life',
    action: {
      type: 'reply',
      text: '42. Six times seven.'
    }
  }];

  before(function() {
    _.extend(actions, {
      find(callback) {
        callback(null, fixture);
      },

      get(id, callback) {
        callback(null, _.find(fixture, '_id', parseInt(id, 10)));
      },

      create(data, callback) {
        data._id = 23;
        fixture.push(data);
        this.emit('created', data);
        callback(null, data);
      }
    });

    app.service('classify').setup(app);
  });

  after(function() {
    _.extend(actions, { find, get, create });
  });

  it('classifies actions', done => {
    classify.create({
      input: 'hey you hear me'
    }, {}, (error, data) => {
      assert.equal(data._id, 0);
      assert.deepEqual(data.action, fixture[0].action);
      assert.equal(data.classifications.length, 3);
      assert.deepEqual(data.pos, {
        tokens: [ 'hey', 'you', 'hear', 'me' ],
        tags: [ 'UH', 'PRP', 'VB', 'PRP' ]
      });

      classify.create({
        input: 'What\'s the meaning of my life?'
      }, {}, (error, data) => {
        assert.equal(data._id, 2);
        assert.deepEqual(data.action, fixture[2].action);
        done();
      });
    });
  });

  it('extracts tags', done => {
    classify.create({
      input: 'Can you please say hi to Gabe'
    }, {}, (error, data) => {
      assert.equal(data._id, 1);
      assert.deepEqual(data.extracted, { subject: ['Gabe'] });
      done();
    });
  });

  it('adding a new action re-trains', done => {
    const newAction = {
      text: 'play some music',
      action: {
        type: 'music',
        mode: 'play'
      }
    };

    actions.create(newAction, (error, action) => {
      classify.create({
        input: 'Can you play music for us?'
      }, {}, (error, data) => {
        assert.equal(data._id, action._id);
        assert.equal(data.text, action.text);
        assert.deepEqual(data.action, action.action);
        done();
      });
    });
  });
});
