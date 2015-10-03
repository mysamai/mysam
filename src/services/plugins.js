import memory from 'feathers-memory';

export default memory({ idField: 'name' }).extend({
  remove: null,
  update: null,
  patch: null
});
