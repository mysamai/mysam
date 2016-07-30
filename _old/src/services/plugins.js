import memory from 'feathers-memory';

export default function() {
  return memory({ idField: 'name' }).extend({
    remove: null,
    update: null,
    patch: null
  });
}
