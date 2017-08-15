import React, { Component } from 'react';
import stationList from './station.json';
import SearchResults from './SearchResults'

import customTheme from './customTheme.js';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PropTypes from 'prop-types';
import {setTime,setStation1,setStation2
	,setOnlyDirect,setClasses
	,requestRoutes,receiveRoutes,fetchRoutes} from './actions'


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

//momentLocalizer(moment);
import { connect } from 'react-redux'

moment.locale('en-gb');
injectTapEventPlugin();


let dataSource=[];

class App extends Component{
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
		if(this.props.showResult){
			return (
				<Motion defaultStyle={{ top: 10}} style={{ top: spring(5,{stiffness: 200, damping: 25}) }}>
					{ (style) =>
						<div style={{ top: style.top+"%"}} className="App-header" key="1">
							<h1 style={{ fontSize: (3.5-((25-style.top)/15))+"rem" }} className="App-title">TRAINHOPPER</h1>
							<p style={{ fontSize: (1.75-1.75)+"rem" }} className="App-intro">A tool for finding train routes between cities</p>
						</div>
					}
				</Motion>
			);
		}
		else if(!this.state.isSearchVisible){
			return (
				<Motion defaultStyle={{ top: 25 }} style={{ top: spring(25,{stiffness: 200, damping: 25}) }}>
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
				<Motion defaultStyle={{ top: 25}} style={{ top: spring(10,{stiffness: 200, damping: 25}) }}>
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
		if(this.props.showResult){
			return (
				<Motion defaultStyle={{ top: 0}} style={{ top: spring( 90,{stiffness: 200, damping: 25}, 30.0) }}>
					{ (style) =>
						<div style={{ width: style.top+"%"}} className="searchResults" key="4">
							<SearchResults routes= {this.props.routes}/>
						</div>
					}
				</Motion>
			);
		}
		else if(this.state.isSearchVisible){
			return (
				<Motion defaultStyle={{ top: 50 }} style={{ top: spring(30,{stiffness: 200, damping: 25}) }}>
				{ (style) =>
					<div style={{top: style.top+"%"}} key="3" className="startButton" >
							<SearchUI setTime= {this.props.setTime} 
							fetchRoutes={this.props.fetchRoutes} 
							station1={this.props.station1}
							station2={this.props.station2}
							setStation1={this.props.setStation1}
							setStation2={this.props.setStation2}
							setOnlyDirect={this.props.setOnlyDirect}
							setClasses={this.props.setClasses}
							onlyDirect={this.props.onlyDirect}
							classes={this.props.classes}
							time={this.props.time}/>
					</div>
				}
				</Motion>
			);
		}else{
			return (
				<Motion defaultStyle={{ top: 45 }} style={{ top: spring(45,{stiffness: 200, damping: 25}) }}>
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
};

App.propTypes= {
  	time: PropTypes.number,
		station1: PropTypes.string,
		station2: PropTypes.string,
		isFetching: PropTypes.bool,
		onlyDirect: PropTypes.bool,
		classes: PropTypes.array,
		routes: PropTypes.array,
    setTime: PropTypes.func,
    setStation1: PropTypes.func,
    setStation2: PropTypes.func,
    setOnlyDirect: PropTypes.func,
    setClasses: PropTypes.func,
    requestRoutes: PropTypes.func,
    receiveRoutes: PropTypes.func,
    fetchRoutes: PropTypes.func,
    showResult: PropTypes.bool,
};


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
				<SelectCities
						setStation1={this.props.setStation1}
						setStation2={this.props.setStation2}
						onHandleNavigation={this.handleNavigation}/>
				<SelectOptions 
						setTime= {this.props.setTime} 
						fetchRoutes={this.props.fetchRoutes} 
						station1={this.props.station1}
						station2={this.props.station2}
						time={this.props.time}
						setOnlyDirect={this.props.setOnlyDirect}
						setClasses={this.props.setClasses}
						onlyDirect={this.props.onlyDirect}
						classes={this.props.classes}
						onHandleNavigation={this.handleNavigation}/>
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
		this.props.setStation1(a.split('(')[1].substring(1,a.split('(')[1].length-2))
	};

	handleNewRequest2 = (a,b) => {
		//alert('called '+a.split('(')[1].substring(1,a.split('(')[1].length-2))
		this.props.setStation2(a.split('(')[1].substring(1,a.split('(')[1].length-2))
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
		this.props.fetchRoutes(this.props.station1,this.props.station2,this.props.time)
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
			this.props.setTime(value.valueOf())
			console.log('Selected Time: ', value.valueOf());
			console.log('Formatted Selected Time: ', dateString);
		}else{
			this.props.setTime(0)
		}
	}
		
	onOk(value) {
		this.props.setTime(value.valueOf())
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
				<ReactModal 
						setOnlyDirect={this.props.setOnlyDirect}
						setClasses={this.props.setClasses}
						onlyDirect={this.props.onlyDirect}
						classes={this.props.classes}
						isOpen={this.state.isModalVisible} 
						isClosed={this.handleModalClosed}/>
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
		this.props.setOnlyDirect(!this.props.onlyDirect)
	}

	handleClassChange(event){
		const classe = event.target.value;
		console.log(this.props.classes.indexOf(classe) +"%%"+classe)
		let tempClasses = this.props.classes;
		if(this.props.classes.indexOf(classe)==-1)
			this.props.classes.push(classe)
		else
			this.props.classes.splice(this.props.classes.indexOf(classe),1)
		this.props.setClasses(this.props.classes)
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

		const buttonClassesActive = "btn btn-outline-primary btn-sm buttons4 active";
		const buttonClassesDisabled = "btn btn-outline-primary btn-sm buttons4";

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
					    checked={this.props.onlyDirect}
					    icons={false}
					    onChange={this.handleDirectTrains} />
					  <p style={{margin: "auto", fontSize: "1rem", marginLeft: "1rem"}}>Show only Direct Trains</p>
					</div>
					<div style={{marginTop: "20px"}}>
						<h6>Preferred Classes</h6>
						<div className="btn-group" data-toggle="buttons" style={{display: "block"}}>
						  <button className= {((this.props.classes).indexOf('a1')>=0)? buttonClassesActive: buttonClassesDisabled} value="a1" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> First AC
						  </button>
						  <button className= {((this.props.classes).indexOf('a2')>=0)? buttonClassesActive: buttonClassesDisabled} value="a2" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Second AC
						  </button>
						  <button className= {((this.props.classes).indexOf('a3')>=0)? buttonClassesActive: buttonClassesDisabled} value="a3" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Third AC
						  </button>
							<button className= {((this.props.classes).indexOf('sl')>=0)? buttonClassesActive: buttonClassesDisabled} value="sl" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Sleeper
						  </button>
						  <button className= {((this.props.classes).indexOf('cc')>=0)? buttonClassesActive: buttonClassesDisabled} value="cc" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> AC Chair Car
						  </button>
						  <button className= {((this.props.classes).indexOf('s2')>=0)? buttonClassesActive: buttonClassesDisabled} value="s2" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Second Class
						  </button>
						  <button className= {((this.props.classes).indexOf('e3')>=0)? buttonClassesActive: buttonClassesDisabled} value="e3" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> Economy
						  </button>
						  <button className= {((this.props.classes).indexOf('fc')>=0)? buttonClassesActive: buttonClassesDisabled} value="fc" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> First Class
						  </button>
						  <button className= {((this.props.classes).indexOf('gen')>=0)? buttonClassesActive: buttonClassesDisabled} value="gen" onClick={this.handleClassChange} style={{margin: "1em -0.5em 0em 1rem"}}>
						    <input type="checkbox" value="1" /> General
						  </button>
						</div>
					</div>
				</div>
			</Modal>
		)
	}
}

const mapStateToProps = state => {
  return {
  	time: state.time,
		station1: state.station1,
		station2: state.station2,
		isFetching: state.isFetching,
		onlyDirect: state.onlyDirect,
		classes: state.classes,
		routes: state.routes,
		showResult: state.showResult,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTime: (time) => {dispatch(setTime(time))},
    setStation1: (station1) => {dispatch(setStation1(station1))},
    setStation2: (station2) => {dispatch(setStation2(station2))},
    setOnlyDirect: (onlyDirect) => {dispatch(setOnlyDirect(onlyDirect))},
    setClasses: (classes) => {dispatch(setClasses(classes))},
    requestRoutes: (station1, station2, date) => {dispatch(requestRoutes(station1, station2, date))},
    receiveRoutes: (json) => {dispatch(receiveRoutes(json))},
    fetchRoutes: (station1, station2, date) => {dispatch(fetchRoutes(station1, station2, date))},
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);