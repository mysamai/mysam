import Q from 'q';
import debug from 'debug';
import BrainJSClassifier from 'natural-brain';
import pos from 'pos';
import crypto from 'crypto';
import _ from 'lodash';

import Extractor from '../extractor';

const log = debug('mysam:classifier');
const lexer = new pos.Lexer();
const tagger = new pos.Tagger();

export function addPos(hook, next) {
  let data = hook.result;
  let tokens = lexer.lex(data.input);
  let tags = tagger.tag(tokens).map(function(touple) {
    return touple[1];
  });

  data.pos = { tokens, tags };
  next();
}

export function extract(hook, next) {
  let data = hook.result;
  let e = new Extractor(lexer.lex(data.text), data.tags || []);

  data.extracted = e.extract(data.pos.tokens);
  next();
}

export default {
  after: {
    create: [addPos, extract]
  },
  create(data, params, callback) {
    log('Classifying', data);

    if(this.retrain) {
      log('Retraining Neural network');
      this.classifier.retrain();
      this.retrain = false;
    }

    let { input } = data;
    let id = crypto.createHash('md5').update(input).digest('hex');
    let action = this.classifier.classify(input);
    let classifications = this.classifier.getClassifications(input);

    Q.ninvoke(this.actions, 'get', action)
      .then(action => {
        return _.extend(action, { id, input, classifications });
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

    // We want to classify every word
    BrainJSClassifier.disableStopWords();

    this.classifier = new BrainJSClassifier({
      iterations: 2000
    });

    this.actions = app.service('actions');
    this.actions.on('created', add);
    //this.actions.on('removed', action => {
    //
    //});

    Q.ninvoke(this.actions, 'find').then(list => {
        list.forEach(add);
        return list;
      })
      .then(list => {
        if(list.length) {
          this.classifier.train();
          this.retrain = false;
        }
      })
      .fail(error => log('ERROR: ', error.stack));
  }
};
