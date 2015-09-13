import Q from 'q';
import debug from 'debug';
import BrainJSClassifier from 'natural-brain';

import Extractor from '../extractor';

const log = debug('mysam:classifier');

export function addPos(hook, next) {
  let pos = this.app.service('pos');
  let data = hook.result;

  pos.create({
    text: data.input
  }, (error, pos) => {
    data.pos = pos;
    next();
  });
}

export function extract(hook, next) {
  let pos = this.app.service('pos');
  let data = hook.result;
  let e = new Extractor(pos.tokenize(data.text), data.tags || []);

  data.extracted = e.extract(data.pos.tokens);
  next();
}

export default {
  after: {
    create: [addPos, extract]
  },
  create(data, params, callback) {
    if(this.retrain) {
      this.classifier.retrain();
      this.retrain = false;
    }

    let input = data.text;
    let action = this.classifier.classify(input);
    let classifications = this.classifier.getClassifications(input);

    Q.ninvoke(this.actions, 'get', action)
      .then(action => {
        return Object.assign(action, {
          input: data.text,
          classifications
        });
      })
      .then(result => {
        log(result);
        return result;
      })
      .fail(err => log(err.stack))
      .nodeify(callback);
  },

  add(action) {
    log('Adding action to training', action);
    this.classifier.addDocument(action.text, '' + action._id);
    this.retrain = true;
  },

  setup(app) {
    let add = this.add.bind(this);

    this.classifier = new BrainJSClassifier();
    this.app = app;

    this.actions = app.service('actions');
    this.actions.on('created', add);
    this.actions.find((error, list) => {
      list.forEach(add);
    });
    this.classifier.train();
  }
};
