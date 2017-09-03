const BrainJSClassifier = require('natural-brain');
const maxBy = require('lodash/maxBy');
const debounce = require('lodash/debounce');
const debug = require('debug')('mysam-server:classifier-service');

// We want to classify every word
BrainJSClassifier.disableStopWords();

module.exports = class Classifier {
  constructor (options = {}) {
    this.classifier = new BrainJSClassifier(Object.assign({
      iterations: 2000
    }, options));
  }

  retrain () {
    const retrain = this._retrain || (this._retrain = debounce(() => {
      debug('Retraining classifier');
      this.classifier.retrain();
      if (typeof this.emit === 'function') {
        debug(`Sending 'trained' event`);
        this.emit('trained', this.classifier);
      }
    }, 250));

    retrain.call(this);
  }

  removeTraining (training) {
    this.classifier.removeDocument(training.text, training.action._id);
    this.retrain();
  }

  addTraining (training) {
    this.classifier.addDocument(training.text, training.action._id);
    this.retrain();
  }

  create ({ text }) {
    const classifications = this.classifier.getClassifications(text);

    debug('Classifications from natural-brain', classifications);

    const classification = maxBy(classifications, current => current.value);
    const result = {
      text,
      action: classification.label,
      confidence: classification.value
    };

    debug('Created classification', result);

    return Promise.resolve(result);
  }
};
