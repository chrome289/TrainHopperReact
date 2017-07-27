import { combineReducers } from 'redux'

import PropTypes from 'prop-types';
import { SET_TIME, SET_STATION_1, SET_STATION_2
	, FETCH_ROUTES, REQUEST_ROUTES, RECEIVE_ROUTES
	, SET_CLASSES, SET_ONLY_DIRECT} from './actions'

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

function ReduxReducer(state = initState, action){
	switch (action.type) {
		case SET_TIME:
			return Object.assign({}, state, {
        time: action.time
      })
		case SET_STATION_1:
			return Object.assign({}, state, {
        station1: action.station1
      })
    case SET_STATION_2:
			return Object.assign({}, state, {
        station2: action.station2
      })
    case REQUEST_ROUTES:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case RECEIVE_ROUTES:
      return Object.assign({}, state, {
        isFetching: false,
        routes: action.routes,
      })
    case SET_ONLY_DIRECT:
     	return Object.assign({}, state, {
     		onlyDirect: action.onlyDirect,
     	})
    case SET_CLASSES:
     	return Object.assign({}, state, {
     		classes: action.classes,
     	})
    default:
    	return state;
	}
}

export default ReduxReducer