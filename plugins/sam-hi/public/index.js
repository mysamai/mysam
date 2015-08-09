export default {
  learn(form, sam) {

  },

  action(el, result, sam) {
    var heading = $('<h1>');
    el.html(heading);
    heading.type(result.action.text);
  }
};
