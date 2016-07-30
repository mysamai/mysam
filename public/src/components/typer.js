import React from 'react';

class Typer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  type(speed = 50) {
    const txt = this.props.text || this.props.children;
    const txtLen = txt.length;

    if(typeof txt !== 'string') {
      throw new Error('Typer text must be a string');
    }

    let char = 0;

    this.setState({ text: '' });

    const type = () => {
      const humanize = Math.round(Math.random() * (speed - 20)) + 30;
      const timeOut = setTimeout(() => {
        const text = txt.substring(0, ++char);
        this.setState({ text });

        if (char === txtLen) {
          clearTimeout(timeOut);
          if(typeof this.props.onEnd === 'function') {
            this.props.onEnd.call(this, text);
          }
        } else {
          type();
        }
      }, humanize);
    };

    if(speed === 0) {
      this.setState({ text: txt });
    } else {
      type();
    }
  }

  componentDidMount() {
    this.type(this.props.speed);
  }

  render() {
    return <span>{this.state.text}</span>;
  }
}

export default Typer;
