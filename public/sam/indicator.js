import Component from 'can/component/';
import stache from 'can/view/stache/';
import indicator from './indicator.stache!';

export default Component.extend({
  tag: 'sam-indicator',
  template: indicator,
  scope: {
    toggle() {
      this.attr('listening', !this.attr('listening'));
    }
  }
});
