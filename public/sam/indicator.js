import Component from 'can/component/';
import stache from 'can/view/stache/';

export default Component.extend({
  tag: 'sam-indicator',
  template: can.stache(`<i can-click="toggle" class="fa
    {{#if listening}}fa-microphone{{else}}fa-microphone-slash{{/if}}">
    </i>`),
  scope: {
    toggle() {
      this.attr('listening', !this.attr('listening'));
    }
  }
});
