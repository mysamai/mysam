export default function(actions) {
  actions.use('hi', function(result, next) {
    let tags = result.tags;
    let index = tags.indexOf('hi');
    let text = 'you';

    if (index === -1) {
      index = result.tags.indexOf('hello');
    }

    index = index + 2;

    if (index && tags[index]) {
      if (tags[index] === 'the') {
        index++;
      }
      text = tags.slice(index, tags.length).join(' ');
    }

    result.action.text = `Hi ${text}!`;

    next();
  });
};
