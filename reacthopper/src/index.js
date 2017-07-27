import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'babel-polyfill'
import { Provider } from 'react-redux'
import Routes from './routes';
import {HashRouter, Route} from 'react-router-dom';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

import ReduxReducer from './reducers.js'

import PropTypes from 'prop-types';

const initState={
	time: 0,
	station1: '',
	station2: '',
	isFetching: false,
	onlyDirect: true,
	classes: ['a1','a2','a3','sl','cc','s2','e3', 'fc', 'gen'],
	routes: [],
    setTime: PropTypes.func,
    setStation1: PropTypes.func,
    setStation2: PropTypes.func,
    setOnlyDirect: PropTypes.func,
    setClasses: PropTypes.func,
    requestRoutes: PropTypes.func,
    receiveRoutes: PropTypes.func,
    fetchRoutes: PropTypes.func,
}

const loggerMiddleware = createLogger()
let store = createStore(ReduxReducer, initState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
  ,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

console.log(store.getState())

ReactDOM.render(
	<Provider store={store}>
    <HashRouter>
        <Route path="/" component={App}/>
    </HashRouter>
  </Provider>
  ,
  document.getElementById('root')
);
registerServiceWorker();
