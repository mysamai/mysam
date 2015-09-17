import memory from 'feathers-memory';

export default memory().extend({
  remove: null,
  update: null,
  patch: null
});
