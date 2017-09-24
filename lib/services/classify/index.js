const Classifier = require('./classify.class');
const md5Id = require('../../hooks/md5-id');
const lowerCase = require('../../hooks/lowercase');
const populate = require('../../hooks/populate');
const extractAction = require('../../hooks/extract-action');
const addTokenization = require('../../hooks/add-tokenization');
const clone = require('../../hooks/clone');

module.exports = function () {
  const app = this;

  app.use('/classify', new Classifier());

  const classify = app.service('classify');

  classify.hooks({
    before: {
      all: [ clone() ],
      create: [ lowerCase('text') ]
    },
    after: {
      create: [
        md5Id(),
        populate('action', { service: 'actions' }),
        extractAction(),
        addTokenization()
      ]
    }
  });

  const trainings = app.service('trainings');
  const add = classify.addTraining.bind(classify);
  const remove = classify.removeTraining.bind(classify);
  const update = training => {
    remove(training);
    add(training);
  };

  trainings.find({ paginate: false })
    .then(trainings => trainings.forEach(add));
  trainings.on('created', add);
  trainings.on('removed', remove);
  trainings.on('updated', update);
  trainings.on('patched', update);
};
