import React, { Component } from 'react';
import './App.css';
import stationList from './station.json';

import customTheme from './customTheme.js';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';


import InputMoment from 'input-moment';

import moment from 'moment';

// It's recommended to set locale in entry file globaly.

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import 'react-widgets/dist/css/react-widgets.css'

import {Motion, spring} from 'react-motion';

import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import Modal from 'react-modal' 
import FaClose from 'react-icons/lib/fa/close'
import Toggle from 'react-toggle'

momentLocalizer(moment);

moment.locale('en-gb');
injectTapEventPlugin();

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
							<h1 style={{ fontSize: (4-((25-style.top)/17.5))+"em" }} className="App-title">TRAINHOPPER</h1>
							<p style={{ fontSize: (2-(((25-style.top)/17.5)/2))+"em" }} className="App-intro">A tool for finding train routes between cities</p>
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
			searchText: ''
		};
		this.handleNavigation = this.handleNavigation.bind(this);
	}

	handleNewRequest = (a,b) => {
		alert('called '+a+b)
		this.setState({
			searchText: '',
		});
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
								maxSearchResults={3}
								dataSource={dataSource}
								onNewRequest={this.handleNewRequest}
								style={{width:'70%'}}
							/>
						</MuiThemeProvider>
						<MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
							<AutoComplete className="searchBox"
								floatingLabelText="To"
								filter={AutoComplete.caseInsensitiveFilter}
								openOnFocus={false}
								maxSearchResults={3}
								dataSource={dataSource}
								onNewRequest={this.handleNewRequest}
								style={{width:'70%'}}
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
			searchText: '',
			isModalVisible: false,
		};
		this.handleNavigation = this.handleNavigation.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleModalClosed = this.handleModalClosed.bind(this);
	}

	handleNewRequest = (a,b) => {
		alert('called '+a+b)
		this.setState({
			searchText: '',
		});
	};

	handleNavigation(){
		this.props.onHandleNavigation();
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

	render(){
		dataSource=[];
		for(var x=0; x<stationList.stations.length;x++){
			dataSource.push(stationList.stations[x]);
		}
		function onChange(value, dateString) {
			console.log('Selected Time: ', value);
			console.log('Formatted Selected Time: ', dateString);
		}
		
		function onOk(value) {
			console.log('onOk: ', value);
		}
	
		return(
			<div>
				<div className="buttonDiv">
					<LocaleProvider locale={enUS}>
						<DatePicker
							showTime
							size="large"
							format="MMMM DD,YYYY -- HH:mm:ss"
							placeholder="Select Date and Time"
							onChange={onChange}
							onOk={onOk}
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

		this.state = {
		};
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
				top                        : '25%',
				left                       : '30%',
				right                      : '30%',
				bottom                     : '25%',
				border                     : '1px solid #ccc',
				background                 : '#fff',
				overflow                   : 'auto',
				WebkitOverflowScrolling    : 'touch',
				borderRadius               : '4px',
				outline                    : 'none',
				padding                    : '20px',
				height										 : '50%'

			}
		};

		return (
			<Modal
				isOpen={this.props.isOpen}
				onRequestClose={this.props.isClosed}
				contentLabel="Modal"
				style={ModalStyle}
			>
				<div className="container" style={{height:"10%"}}>
					<h3 style={{float: "left"}}>Filters and Preferences</h3>
					<button className="btn btn-outline-primary buttons3" style={{float: "right", display: "inline-flex"}} onClick={this.props.isClosed}>
						<FaClose style={{height: "1.4em"}}/> 
						<p style={{marginLeft: "4px", height: "1em"}}>Close</p>
					</button>
				</div>
				<div className="form-check" style={{marginTop: "30px",marginLeft: "20px"}}>
					<div style={{display: "inline-flex", marginLeft: "1em"}}>
					  <Toggle
					    defaultChecked={false}
					    icons={false}
					    onChange={this.handleDirectTrains} />
					  <p style={{margin: "auto", fontSize: "1.25em", marginLeft: "1em"}}>Show only Direct Trains</p>
					</div>
					<div style={{marginTop: "20px"}}>
						<h6>Preferred Classes</h6>
						<div clasNames="btn-group" data-toggle="buttons">
						  <label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> First AC
						  </label>
						  <label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> Second AC
						  </label>
						  <label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> Third AC
						  </label>
							<label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> Sleeper
						  </label>
						  <label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> AC Chair Car
						  </label>
						  <label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> Second Class
						  </label>
						  <label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> Economy
						  </label>
						  <label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> First Class
						  </label>
						  <label className="btn btn-outline-primary buttons4 active" style={{margin: "1em -0.5em 0em 1em"}}>
						    <input type="checkbox" autocomplete="off"/> General
						  </label>
						</div>
					</div>
				</div>
			</Modal>
		)
	}
}

export default App;
