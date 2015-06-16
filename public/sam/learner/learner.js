import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import template from './learner.stache!';
import Learning from '../models/learning';
import Classify from '../models/classify';

export const ViewModel = Map.extend({
  define: {
    action: {
      value: '{ "action": "" }'
    }
  },

  save() {
    let input = this.attr('transcript');
    let action = JSON.parse(this.attr('action'));
    let data = { input, action };

    console.log(data);

    new Learning(data).save().then(function(result) {
      console.log(result);
    }, function(err) {
      console.error(err.stack);
    });
  }
});

export default Component.extend({
  tag: 'sam-learner',
  template,
  viewModel: ViewModel,
  events: {
    '{scope} transcript': function(cls, ev, value) {
      new Classify({
        input: value
      }).save().then(function(result) {
          console.log(result.attr());
      }, function() {
          console.log(arguments);
      });
    }
  }
});
