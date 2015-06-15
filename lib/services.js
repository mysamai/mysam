import BrainJSClassifier from 'natural-brain';
import mongodb from 'feathers-mongodb';

const actions = mongodb({
  connectionString,
  collection: 'actions'
});

const learnings = mongodb({
  connectionString,
  collection: 'learning'
}).extend({
  create(data, params, callback) {
    let actions = this.app.service('actions');
    let _super = this._super.bind(this);

    if(typeof data.action === 'object') {
      actions.create(data.action, (error, action) => {
        _super({
          input: data.input,
          action: action
        }, params, callback);
      });
    } else {
      _super(data, params, callback);
    }
  },

  setup(app) {
    this.app = app;
  }
});