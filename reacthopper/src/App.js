import React, { Component } from 'react';
import logo from './logo.svg';
import background_image from './background.jpeg';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<div className="App-header">
					<h1 className="App-title">TRAINHOPPER</h1>
					<p className="App-intro">An Ingenius tool for finding train routes between cities</p>
					{/*<div className="input-group buttonDiv">
						<input className="form-control col-md-5 buttons" type='text' placeholder='From' name='from'/>
						<input className="form-control col-md-5 buttons" type='text' placeholder='To' name='to'/>
					</div>*/}
					<button type="button" className="btn btn-primary btn-lg buttons">Start</button>
				</div>
			</div>
		);
	}
}

export default App;
