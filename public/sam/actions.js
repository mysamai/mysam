const actions = {
  itunes(el, result) {
    let track = result.action.track;
    let name = $('<h1 class="fadeIn animated">').html(track.name);
    let title = $('<h2>').type(track.artist);

    el.empty().append(name).append(title);
  },

  error(el) {
    el.html('<i class="fa fa-question placeholder animated fadeIn"></i>');
  },

  reply(el, result) {
    var heading = $('<h1>');
    el.html(heading);
    heading.type(result.action.text);
  },

  hi(el, result) {
    actions.reply(el, result);
  },

  about(el, result) {
    actions.reply(el, result);
  }
};

export default actions;
