import mongodb from 'feathers-mongodb';
import Q from 'q';

const connectionString = "mongodb://localhost:27017/sam";

export const actions = mongodb({
  connectionString,
  collection: 'actions'
});

export const learnings = mongodb({
  connectionString,
  collection: 'learning'
}).extend({
  create(data, params, callback) {
    let actions = this.app.service('actions');
    let _super = this._super.bind(this);

    if(typeof data.action === 'object') {
      return Q.ninvoke(actions, 'create', data.action)
        .then(action => Q.nfcall(_super, { input: data.input, action: action._id }))
        .nodeify(callback);
    }

    return _super(... arguments);
  },

  setup(app) {
    this.app = app;
  }
});