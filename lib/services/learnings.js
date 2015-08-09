import { Service } from 'feathers-nedb';

export default Service.extend({
  create(data, params, callback) {
    let actions = this.app.service('actions');
    let _super = this._super.bind(this);
    let action = data.action;

    if(typeof data.action === 'object') {
      // Find an existing action
      return Q.ninvoke(actions, 'find', { query: action })
        .then(actions => {
          if(actions.length === 1) {
            return actions[0];
          }

          // Or create a new action
          return Q.ninvoke(actions, 'create', action);
        })
        .then(action => Q.nfcall(_super, { input: data.input, action: action._id }))
        .nodeify(callback);
    }

    return _super(... arguments);
  },

  setup(app) {
    this.app = app;
  }
});
