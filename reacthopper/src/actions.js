import fetch from 'isomorphic-fetch'

export const SET_TIME = 'SET_TIME'
export const SET_STATION_1 = 'SET_STATION_1'
export const SET_STATION_2 = 'SET_STATION_2'

export const SET_ONLY_DIRECT = 'SET_ONLY_DIRECT'
export const SET_CLASSES = 'SET_CLASSES'

export const REQUEST_ROUTES = 'REQUEST_ROUTES'
export const RECEIVE_ROUTES = 'RECEIVE_ROUTES'
export const SHOW_RESULTS = 'SHOW_RESULTS'

export function setTime(time){
	return { type: 'SET_TIME', time: time}
}

export function setStation1(station1){
	return { type: 'SET_STATION_1', station1:station1}
}

export function setStation2(station2){
	return { type: 'SET_STATION_2', station2: station2}
}

export function setOnlyDirect(onlyDirect){
	return { type: 'SET_ONLY_DIRECT', onlyDirect: onlyDirect}
}

export function setClasses(classes){
	return { type: 'SET_CLASSES', classes: classes}
}

export function setShowResults(value){
	return { type: 'SHOW_RESULTS', value: value}
}

export function requestRoutes(station1, station2, date) {
  return {
    type: REQUEST_ROUTES,
    station1: station1,
    station2: station2,
    date: date,
  }
}

export function receiveRoutes(json) {
	console.log("^^^"+json.result+"^^^");
  return {
    type: RECEIVE_ROUTES,
    routes: json.result,
  }
}

export function fetchRoutes(station1, station2, date){
  //var params = {from: station1, to: station2, direct: "false", classes: "['a1','a2','a3','sl']", sort: 1, utcoffset: 19800000, time: date }
  //console.log(params.to+"$$$"+params.from);
	return(function(dispatch){
		dispatch(requestRoutes())
		var url = new URL("http://192.168.1.6:8081/results");
		return fetch(url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
        body: "from="+"LKO"+"&to="+"NDLS"+"&direct=false&classes=['a1','a2','a3','sl']&sort=1&utcoffset=19800000&time="+"1503469584000"
      })
			.then((response) => {
       return response.json() // << This is the problem
    })
    .then((responseData) => { // responseData = undefined
        console.log(responseData)
        dispatch(receiveRoutes(responseData))
        dispatch(setShowResults(true));
    })
	})
}
