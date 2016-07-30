import React from 'react';
import RxJS from 'rxjs';
import each from 'lodash/each';

class Component extends React.Component {
  constructor(props) {
    super(props);
    const observables = this.observables = {};
    each(props, (value, key) => {
      if(typeof value === 'object' && value instanceof RxJS.Observable) {
        observables[key] = value;
      }
    });
    this.state = {};
  }

  componentWillMount() {
    this._subscriptions = {};
    each(this.observables, (value, key) => {
      this._subscriptions[key] = value.subscribe(
        data => this.setState({ [key]: data })
      );
    });
  }

  // componentWillReceiveProps(props) {

  // }

  componentWillUnmount() {
    each(this._subscriptions, observable => observable.unsubscribe());
    delete this._subscriptions;
  }
}

export default Component;
