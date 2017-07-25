import React, { Component } from 'react';
import stationList from './station.json';

import customTheme from './customTheme.js';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';


//import InputMoment from 'input-moment';

import moment from 'moment';

/*import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import 'react-widgets/dist/css/react-widgets.css'
*/
import {Motion, spring} from 'react-motion';

import { DatePicker } from 'antd';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import Modal from 'react-modal' 
import FaClose from 'react-icons/lib/fa/close'
import Toggle from 'react-toggle'

import './App.css';

import { Provider } from 'react-redux'
import { setTime, setStation1, setStation2 ,fetchRoutes, setOnlyDirect, setClasses} from './actions'
import ReduxReducer from './reducers.js'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
//momentLocalizer(moment);

moment.locale('en-gb');
injectTapEventPlugin();

const loggerMiddleware = createLogger()
let store = createStore(ReduxReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  ))

console.log(store.getState());

let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

let dataSource=[];

class App extends Component {
	constructor(props){
		super(props);
		this.showSearch = this.showSearch.bind(this);
		this.getHeader = this.getHeader.bind(this);
		this.state={
			isSearchVisible :	false
		}
	}

	showSearch(){
		if(this.state.isSearchVisible){
			this.setState({isSearchVisible : false});
		}else{
			this.setState({isSearchVisible : true });
		}
	}

	getHeader(){
		if(!this.state.isSearchVisible){
			return (
				<Motion defaultStyle={{ top: 25 }} style={{ top: spring(25,{stiffness: 200, damping: 20}) }}>
					{ (style) =>
						<div style={{top: style.top+"%"}} className="App-header" key="1">
							<h1 className="App-title">TRAINHOPPER</h1>
							<p className="App-intro">A tool for finding train routes between cities</p>
						</div>
					}
				</Motion>
			);
		}else{
			return (
				<Motion defaultStyle={{ top: 25}} style={{ top: spring(10,{stiffness: 140, damping: 20}) }}>
					{ (style) =>
						<div style={{ top: style.top+"%"}} className="App-header" key="1">
							<h1 style={{ fontSize: (3.5-((25-style.top)/20))+"rem" }} className="App-title">TRAINHOPPER</h1>
							<p style={{ fontSize: (1.75-(((25-style.top)/20)/2))+"rem" }} className="App-intro">A tool for finding train routes between cities</p>
						</div>
					}
				</Motion>
			);
		}
	}

	getBody(){
		if(this.state.isSearchVisible){
			return (
				<Motion defaultStyle={{ top: 50 }} style={{ top: spring(30,{stiffness: 140, damping: 20}) }}>
				{ (style) =>
					<div style={{top: style.top+"%"}} className="startButton" key="3">
						<SearchUI/>
					</div>
				}
				</Motion>
			);
		}else{
			return (
				<Motion defaultStyle={{ top: 45 }} style={{ top: spring(45,{stiffness: 140, damping: 20}) }}>
				{ (style) =>
					<div style={{top: style.top+"%"}} className="startButton">
						<button type="button" className="btn btn-primary btn-lg buttons" onClick={this.showSearch}>Start</button>
					</div>
				}
				</Motion>
			);
		}
	}

	render() {
		return (
			<div className="App">
				{this.getHeader()}
				{this.getBody()}
			</div>
		);
	}
}


class SearchUI extends Component{
	constructor(props){
		super(props);
		this.state = {};
		this.handleNavigation = this.handleNavigation.bind(this);
	}
	
	handleNavigation(){
	}

	render(){
		return(
			<div>
				<SelectCities onHandleNavigation={this.handleNavigation}/>
				<SelectOptions onHandleNavigation={this.handleNavigation}/>
			</div>
		);
	}
}

class SelectCities extends Component{
	constructor(props){
		super(props);
		this.state = {
			searchText: '',
			from: '',
			to: ''
		};
		this.handleNavigation = this.handleNavigation.bind(this);
	}

	handleNewRequest1 = (a,b) => {
		//alert('called '+a.split('(')[1].substring(1,a.split('(')[1].length-2))
		store.dispatch(setStation1(a.split('(')[1].substring(1,a.split('(')[1].length-2)))
	};

	handleNewRequest2 = (a,b) => {
		//alert('called '+a.split('(')[1].substring(1,a.split('(')[1].length-2))
		store.dispatch(setStation2(a.split('(')[1].substring(1,a.split('(')[1].length-2)))
	};

	handleNavigation(){
		this.props.onHandleNavigation(1,0);
	}


	render(){
		dataSource=[];
		for(var x=0; x<stationList.stations.length;x++){
			dataSource.push(stationList.stations[x]);
		}

		return(
					<div className="input-group buttonDiv">
						<MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
							<AutoComplete className="searchBox"
								floatingLabelText="From"
								filter={AutoComplete.caseInsensitiveFilter}
								openOnFocus={false}
								maxSearchResults={5}
								dataSource={dataSource}
								onNewRequest={this.handleNewRequest1}
								style={{float: "left", width: "40%", position: "relative",margin: "0px auto 0px 5%"}}
							/>
						</MuiThemeProvider>
						<MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
							<AutoComplete className="searchBox"
								floatingLabelText="To"
								filter={AutoComplete.caseInsensitiveFilter}
								openOnFocus={false}
								maxSearchResults={5}
								dataSource={dataSource}
								onNewRequest={this.handleNewRequest2}
								style={{float: "right", width: "40%", position: "relative",margin: "0px 5% 0px auto"}}
								anchorOrigin={{vertical: 'bottom',horizontal: 'right'}}
								targetOrigin={{vertical: 'top',horizontal: 'right'}}							
							/>
						</MuiThemeProvider>
					</div>
		);
	}
}

class SelectOptions extends Component{
	constructor(props){
		super(props);
		this.state = {
			time: 0,
			isModalVisible: false,
		};
		this.handleNavigation = this.handleNavigation.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleModalClosed = this.handleModalClosed.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onOk = this.onOk.bind(this);
	}

	handleNavigation(){
		const tempState=store.getState();
		store
  		.dispatch(fetchRoutes(tempState.station1,tempState.station2,tempState.time))
  		.then(() => console.log(store.getState()))
	};

	handleModalOpen(){
		this.setState({
			isModalVisible: true,
		});
		
	};

	handleModalClosed(){
		this.setState({
			isModalVisible: false,
		});
		
	};
	onChange(value, dateString) {
		if(value!=null){
			store.dispatch(setTime(value.valueOf()))
			console.log('Selected Time: ', value.valueOf());
			console.log('Formatted Selected Time: ', dateString);
		}else{
			store.dispatch(setTime(0))
		}
	}
		
	onOk(value) {
		store.dispatch(setTime(value.valueOf()))
		console.log('Selected Time: ', value.valueOf());
	}

	render(){
		dataSource=[];
		for(var x=0; x<stationList.stations.length;x++){
			dataSource.push(stationList.stations[x]);
		}
	
		return(
			<div>
				<div className="buttonDiv">
					<LocaleProvider locale={enUS}>
						<DatePicker
							showTime
							size="large"
							format="MMMM DD,'YY  HH:mm:ss"
							placeholder="Select Date and Time"
							onChange={this.onChange}
							onOk={this.onOk}
							className="datetimepickers"
						/>
					</LocaleProvider>
				</div>
				<div className="buttonDiv">
					<button type="button" className="btn btn-link buttonsLink" onClick={this.handleModalOpen}>Filters and Preferences</button>
				</div>
				<div className="input-group buttonDiv">
					<button type="button" className="btn btn-outline-primary btn-lg buttons2" onClick={this.handleNavigation}>Search</button>
				</div>
				<ReactModal isOpen={this.state.isModalVisible} isClosed={this.handleModalClosed}/>
			</div>
		);
	}
}

class ReactModal extends Component {
	
	constructor(props) {
		super(props);
		this.handleDirectTrains = this.handleDirectTrains.bind(this);
		this.handleClassChange = this.handleClassChange.bind(this);
	}

	handleDirectTrains(){
		const tempState = store.getState();
		store.dispatch(setOnlyDirect(!tempState.onlyDirect))
	}

	handleClassChange(event){
		const classe = event.target.value;
		const tempState = store.getState();
		console.log(tempState.classes.indexOf(classe) +"%%"+classe)
		if(tempState.classes.indexOf(classe)==-1)
			store.dispatch(setClasses(tempState.classes.push(classe)))
		else
			store.dispatch(setClasses(tempState.classes.splice(tempState.classes.indexOf(classe),1)))
	}

	render(){

		const ModalStyle={
			overlay : {
				position          : 'fixed',
				top               : 0,
				left              : 0,
				right             : 0,
				bottom            : 0,
				backgroundColor   : 'rgba(0, 0, 0, 0.25)'
			},
			content : {
				position                   : 'absolute',
				top                        : '10%',
				left                       : '10%',
				right                      : '10%',
				bottom                     : '10%',
				border                     : '1px solid #ccc',
				background                 : '#fff',
				overflow                   : 'auto',
				WebkitOverflowScrolling    : 'touch',
				borderRadius               : '4px',
				outline                    : 'none',
				padding                    : '1rem',
				maxWidth									 : '600px',
   			maxHeight									 : '600px',
   			margin										 : 'auto'
			}
		};

		return (
			<Modal
				isOpen={this.props.isOpen}
				onRequestClose={this.props.isClosed}
				contentLabel="Modal"
				style={ModalStyle}
			>
				<div className="container" style={{height:"10%", display:"flex"}}>
					<h3 style={{float: "left", margin:"auto auto auto 0"}}>Filters and Preferences</h3>
					<button className="btn btn-outline-primary buttons3" style={{float: "right", display: "inline-flex", margin:"auto 0 auto auto"}} onClick={this.props.isClosed}>
						<FaClose style={{height: "1.4rem"}}/> 
						<p style={{marginLeft: "4px", height: "1rem"}}>Close</p>
					</button>
				</div>
				<div className="form-check" style={{marginTop: "30px"}}>
					<div style={{display: "inline-flex", marginLeft: "1rem"}}>
					  <Toggle
					    defaultChecked={true}
					    icons={false}
					    onChange={this.handleDirectTrains} />
					  <p style={{margin: "auto", fontSize: "1rem", marginLeft: "1rem"}}>Show only Direct Trains</p>
					</div>
					<div style={{marginTop: "20px"}}>
						<h6>Preferred Classes</h6>
						<div className="btn-group" data-toggle="buttons" style={{display: "block"}}>
						  <button className="btn btn-outline-primary btn-sm buttons4 active" value="a1" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> First AC
						  </button>
						  <button className="btn btn-outline-primary btn-sm buttons4 active" value="a2" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Second AC
						  </button>
						  <button className="btn btn-outline-primary btn-sm buttons4 active" value="a3" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Third AC
						  </button>
							<button className="btn btn-outline-primary btn-sm buttons4 active" value="sl" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Sleeper
						  </button>
						  <button className="btn btn-outline-primary btn-sm buttons4 active" value="cc" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> AC Chair Car
						  </button>
						  <button className="btn btn-outline-primary btn-sm buttons4 active" value="s2" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Second Class
						  </button>
						  <button className="btn btn-outline-primary btn-sm buttons4 active" value="e3" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Economy
						  </button>
						  <button className="btn btn-outline-primary btn-sm buttons4 active" value="fc" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> First Class
						  </button>
						  <button className="btn btn-outline-primary btn-sm buttons4 active" value="gen" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> General
						  </button>
						</div>
					</div>
				</div>
			</Modal>
		)
	}
}

export default App;
