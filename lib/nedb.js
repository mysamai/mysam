import Datastore from 'nedb';

export default class Service {
  constructor(options) {
    this.db = new Datastore(options);
  }

  find(params, callback) {
    this.db.find(params.query || {}, callback);
  }

  get(id, params, callback) {

  }

  create(data, params, callback) {
    this.db.insert(data, callback);
  }

  update(id, data, params, callback) {

  }

  patch(id, data, params, callback) {

  }

  remove(id, params, callback) {

  }
}
