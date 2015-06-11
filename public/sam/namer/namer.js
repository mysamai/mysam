import Component from 'can/component/';
import Map from 'can/map/';
import template from './namer.stache!';

export const ViewModel = Map.extend({
  save() {

  }
});

export default Component.extend({
  tag: 'sam-namer',
  template,
  viewModel: ViewModel,
  events: {
    'form submit': function(el, ev) {
      ev.preventDefault();
    },

    ' type-end': function() {
      this.element.find('.animated').toggleClass('hidden fadeIn');
      this.element.find('input').focus();
    }
  }
});
