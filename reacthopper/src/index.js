import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'babel-polyfill'

import Routes from './routes';
import {HashRouter, Route} from 'react-router-dom';

ReactDOM.render(
    <HashRouter>
        <Route path="/" component={App}/>
    </HashRouter>
  ,
  document.getElementById('root')
);
registerServiceWorker();
