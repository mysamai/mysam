module.exports = function populate (target, options) {
  options = Object.assign({}, options);

  if (!options.service) {
    throw new Error('You need to provide a service');
  }

  const field = options.field || target;

  return function (hook) {
    function populate (item) {
      if (!item[field]) {
        return Promise.resolve(item);
      }

      // Find by the field value by default or a custom query
      const id = item[field];

      // If it's a mongoose model then
      if (typeof item.toObject === 'function') {
        item = item.toObject(options);
      } else if (typeof item.toJSON === 'function') { // If it's a Sequelize model
        item = item.toJSON(options);
      }
      // Remove any query from params as it's not related
      const params = Object.assign({}, hook.params, { query: undefined });
      // If the relationship is an array of ids, fetch and resolve an object for each, otherwise just fetch the object.
      const promise = Array.isArray(id) ? Promise.all(id.map(objectID => hook.app.service(options.service).get(objectID, params))) : hook.app.service(options.service).get(id, params);
      return promise.then(relatedItem => {
        if (relatedItem) {
          item[target] = relatedItem;
        }
        return item;
      });
    }

    if (hook.type === 'after') {
      const isPaginated = (hook.method === 'find' && hook.result.data);
      const data = isPaginated ? hook.result.data : hook.result;

      if (Array.isArray(data)) {
        return Promise.all(data.map(populate)).then(results => {
          if (isPaginated) {
            hook.result.data = results;
          } else {
            hook.result = results;
          }

          return hook;
        });
      }

      // Handle single objects.
      return populate(hook.result).then(item => {
        hook.result = item;
        return hook;
      });
    }
  };
};
