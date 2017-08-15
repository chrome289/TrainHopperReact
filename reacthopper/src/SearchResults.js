import React, { Component } from 'react';

import './App.css';

class SearchResults extends Component{
	constructor(props){
		super(props);
		this.combineResults = this.combineResults.bind(this);
	}
	combineResults(){
		console.log('ia am called '+this.props.routes.size)
		let combinedResults = [];
		for(var x=0;x<this.props.routes.length;x++){
			combinedResults.push(
				<div className="searchResult" key={x}>
					<div style={{display: "inline-flex",width: "100%", padding: "0.25rem"}}>
						<div className="searchDiv1" style={{width: "30%"}}>
							<p style={{padding: ".25rem", borderRight: "2px dashed #ff6336"}}>{this.props.routes[x].train_name}</p>
						</div>
						<div className="searchDiv1" style={{color: "#000", display: "block", width: "25%", padding: "0.25rem"}}>
							<p style={{margin: "auto"}}>{this.props.routes[x].arrival} (OHU)</p>
						</div>
						<div className="searchDiv1" style={{color: "#000", display: "block", width: "25%", padding: "0.25rem", borderRight: "2px dashed #ff6336"}}>
							<p style={{margin: "auto"}}>{this.props.routes[x].departure} +1 (AUS)</p>
						</div>
						<p style={{color: "#000", margin: "auto", padding: "0.25rem", width: "20%", fontSize: "1.5rem"}}>{this.props.routes[x].total_duration} HRS</p>
					</div>
				</div>
			);
		}
		return combinedResults;
	}

	render(){
		console.log('ia am called '+this.props.routes);
		return(
			<div>
				<p className="searchHeading">You searched for Marseilles to Paris for April 25, 1984</p>
				<div style={{overflowY: "auto"}}>
					{this.combineResults()}
				</div>
			</div>
		);
	}
}

export default SearchResults;