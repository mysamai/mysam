export default class ClassifierService {
  create(data, params, callback) {
    if(!this.trained) {
      this.classifier.train();
      this.trained = true;
    }
    console.log(this.classifier.getClassifications(data.transcript));
    var action = this.classifier.classify(data.transcript);
    this.app.service('actions').get(action, (error, action) => {
      callback(null, {
        input: data,
        action: action
      })
    });
  }

  add(learning) {
    this.classifier.addDocument(learning.text, learning.action);
    this.trained = false;
  }

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
}