import Q from 'q';
import _ from 'lodash';
import BrainJSClassifier from 'natural-brain';
import pos from 'pos';
import actions from './actions';

export default {
  create(data, params, callback) {
    if(!this.trained) {
      this.classifier.train();
      this.trained = true;
    }

    let app = this.app;
    let input = data.input;
    let action = this.classifier.classify(input);
    let classifications = this.classifier.getClassifications(input);
    let words = new pos.Lexer().lex(input);
    let taggedWords = new pos.Tagger().tag(words);

    Q.ninvoke(this.app.service('actions'), 'get', action)
      .then(action => {
        return {
          id: new Date().getTime(),
          input: data,
          tags: taggedWords.map(touple => touple[0]),
          pos: taggedWords.map(touple => touple[1]),
          action,
          classifications
        };
      })
      .then(result => {
        let current = result.action.action;
        if(actions[current]) {
          return actions[current](result, app).then(data => {
            _.extend(result.action, data);
            return result;
          });
        }
        return result;
      })
      .then(result => {
        console.log(result);
        return result;
      })
      .fail(err => console.error(err.stack))
      .nodeify(callback);
  },

  add(learning) {
    console.log('Adding document', learning);
    this.classifier.addDocument(learning.input, learning.action);
    this.trained = false;
  },

  setup(app) {
    let learnings = app.service('learnings');
    let add = this.add.bind(this);

    this.classifier = new BrainJSClassifier();
    this.app = app;

    learnings.on('created', add);

    learnings.find((error, learnings) => {
      learnings.forEach(add);
    });
  }
};
