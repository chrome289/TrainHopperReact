export const SET_TIME = 'SET_TIME'
export const SET_STATION_1 = 'SET_STATION_1'
export const SET_STATION_2 = 'SET_STATION_2'

export function setTime(time){
	return { type: 'SET_TIME', time}
}

export function setStation1(station1){
	return { type: 'SET_STATION_1', station1}
}

export function setStation2(station2){
	return { type: 'SET_STATION_2', station2}
}