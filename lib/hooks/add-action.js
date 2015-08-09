import Q from 'q';

export default function(hook) {
  if(typeof hook.data.action === 'object') {
    let actions = this.app.service('actions');
    let action = data.action;

    // Find an existing action
    return Q.ninvoke(actions, 'find', { query: action })
      .then(actions => {
        if(actions.length === 1) {
          return actions[0];
        }

        // Or create a new one
        return Q.ninvoke(actions, 'create', action);
      })
      // Update the hook data with the new action id
      .then(action => hook.data.action = action._id);
  }

  return Q(null);
}
