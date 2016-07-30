import 'animate.css/animate.css!';
import './styles.less!';
import React from 'react';
import ReactDOM from 'react-dom';
import RxJS from 'rxjs';

import app from './app';
import Typer from './components/typer';
import Toolbar from './components/toolbar';

const recognizer = app.service('recognizer');
const recognition = recognizer.create({ id: 'current' });

ReactDOM.render(<div className="full">
  <Toolbar recognizer={recognizer} recognition={recognition} />
  <div id="main">
    <h1><Typer>Hi I'm here... kind of</Typer></h1>
  </div>
</div>, document.getElementById('content'));
