import $ from './plugins';
import can from 'can';
import index from './index.stache!';

$(() => {
  $('#main').append(index({}));
});
