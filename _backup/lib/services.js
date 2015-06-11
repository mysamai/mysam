import mongodb from 'feathers-mongodb';
import when from 'when';
import BrainJSClassifier from 'natural-brain';

export const classifiers = {
  classifiers: {},

  get(name, params) {
    return when(this.classifiers[name]);
  },

  create(data) {
    let c = this.classifiers[data.name] = new BrainJSClassifier();
    return when(c);
  },

  patch(name, data) {
    let c = this.classifiers[name];
    c.addDocument(data.text, data.label);
    return when(c);
  },

  classify(name, text) {
    let c = this.classifiers[name];
    c.train();
    console.log(c.getClassifications(text))
    return when(c.getClassifications(text));
  }
};

export const classification = {
  create(data, params) {
    let service = this.app.service('classifiers');
    return service.classify(data.name, data.text);
  },

  setup(app) {
    this.app = app;
  }
};
