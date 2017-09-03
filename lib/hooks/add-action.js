const omit = require('lodash/omit');

module.exports = function () {
  return function (hook) {
    const data = hook.data;

    if (typeof data.action === 'object') {
      const actions = hook.app.service('actions');

      return actions.find({
        query: omit(data.action, 'text'),
        paginate: false
      }).then(existingActions => {
        if (existingActions.length > 1) {
          throw new Error('Ambigious action');
        }

        if (existingActions.length === 1) {
          return existingActions[0];
        } else {
          return actions.create(Object.assign({}, data.action, {
            text: data.text
          }));
        }
      }).then(action => {
        data.action = action._id;
        return hook;
      });
    }
  };
};
