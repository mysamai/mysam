exports.defaultService = function (app, service) {
  return function (location) {
    const paginate = app.get('paginate');

    return service({
      paginate,
      startId: 1,
      id: '_id'
    });
  };
};
