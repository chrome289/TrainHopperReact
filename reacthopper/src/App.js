import React, { Component } from 'react';
import './App.css';
import { CSSTransitionGroup } from 'react-transition-group'
import stationList from './station.json';

import customTheme from './customTheme.js';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';


import moment from 'moment';
import InputMoment from 'input-moment';

import Datetime from 'react-datetime';


injectTapEventPlugin();

let dataSource=[];

class App extends Component {
	
	constructor(props){
		super(props);
		this.showSearch = this.showSearch.bind(this);
		this.state={
			isSearchVisible :	false
		}
	}

	showSearch(){
		if(this.state.isSearchVisible){
			this.setState({isSearchVisible : false});
			return null;
		}else{
			this.setState({isSearchVisible : true});
			return <SearchUI/>;
		}
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<h1 className="App-title">TRAINHOPPER</h1>
					<p className="App-intro">A tool for finding train routes between cities</p>
					{this.state.isSearchVisible?
						<SearchUI/>:
						<button type="button" className="btn btn-primary btn-lg buttons" onClick={this.showSearch}>Start</button>
					}
				</div>
			</div>
		);
	}
}


class SearchUI extends Component{
	constructor(props){
		super(props);
		this.state = {
			searchText: ''
		};
	}

	handleNewRequest = (a,b) => {
		alert('called '+a+b)
		this.setState({
			searchText: '',
		});
	};

	handleNext(){

	}


	render(){
		dataSource=[];
		for(var x=0; x<stationList.stations.length;x++){
			dataSource.push(stationList.stations[x]);
		}

		return(
			<CSSTransitionGroup
			transitionName="searchUI"
			transitionAppear={true}
			transitionAppearTimeout={500}
			transitionEnter={false}
			transitionLeave={false}>
				<div>
					<div className="input-group buttonDiv">
						<MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
							<AutoComplete className="searchBox"
								floatingLabelText="From"
								filter={AutoComplete.caseInsensitiveFilter}
								openOnFocus={false}
								maxSearchResults={3}
								dataSource={dataSource}
								onNewRequest={this.handleNewRequest}
								style={{width:'100%'}}
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
								style={{width:'100%'}}
							/>
						</MuiThemeProvider>
					</div>
					<button type="button" className="btn btn-primary btn-lg buttons" onClick={this.handleNext}>Next</button>
				</div>
			</CSSTransitionGroup>
		);
	}
}

class SelectorUI extends Component{
	render(){
		return(
			<CSSTransitionGroup
			transitionName="selectorUI"
			transitionAppear={true}
			transitionAppearTimeout={500}
			transitionEnter={false}
			transitionLeave={false}>
				<div>
					<div className="input-group buttonDiv">
						<MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
							<AutoComplete className="searchBox"
								floatingLabelText="From"
								filter={AutoComplete.caseInsensitiveFilter}
								openOnFocus={false}
								maxSearchResults={3}
								dataSource={dataSource}
								onNewRequest={this.handleNewRequest}
								style={{width:'100%'}}
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
								style={{width:'100%'}}
							/>
						</MuiThemeProvider>
					</div>
					<div className="input-group buttonDiv">
						<button type="button" className="btn btn-primary btn-lg buttons" onClick={this.handleNext}>Next</button>
						<button type="button" className="btn btn-primary btn-lg buttons" onClick={this.handleNext}>Next</button>
					</div>
				</div>
			</CSSTransitionGroup>
		);
	}
}

export default App;
