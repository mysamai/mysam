import React from 'react';
import Component from './base';
import app from '../app';

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = { recognition: {} };
  }

  render() {
    const recognition = this.state.recognition;
    // <i className="fa fa-spinner fa-spin"></i>
    return <mysam-toolbar>
      <div className="padded">
        <div className="pull-right">
          <small>{recognition.text}</small>
          <i onClick={() => this.props.recognizer.toggle()}
            className={`fa ${recognition.listening ? 'fa-microphone' : 'fa-microphone-slash'}`}>
          </i>
        </div>
      </div>
    </mysam-toolbar>
  }
}

export default Toolbar;
