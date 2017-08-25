import React, { Component } from 'react';
import outline from './ic_error_outline_white_18dp_1x.png'
import MaIcon from 'react-icons/lib/md/arrow-forward'

import './App.css';

class SearchResults extends Component{
	constructor(props){
		super(props);
		this.combineResults = this.combineResults.bind(this);
	}
	combineResults(){
		console.log('ia am called '+this.props.routes.size)
		let combinedResults = [];
		for(var x=0;x<1;x++){
			combinedResults.push(
				<div className="searchResult" key={x}>
					{/**/}
					<div style={{padding: "0.5rem"}}>
						<p style={{fontSize: "1.25rem"}}>Toronto Express and Lototo Mail</p>
						<div style={{display: "inline-flex", marginTop: "0.5rem", marginLeft: "1rem"}}>
							<div>
								<p style={{fontSize: "1.5rem", lineHeight: "1.6rem"}}>10:45 AM</p>
								<p style={{fontSize: "0.75rem"}}>August 19, 2017</p>
							</div>
							<MaIcon style={{verticalAlign: "middle", margin: "auto 1rem", height: "1.75rem",width: "1.75rem"}}/>
							<div>
								<p style={{fontSize: "1.5rem", lineHeight: "1.6rem"}}>06:00 PM</p>
								<p style={{fontSize: "0.75rem"}}>August 19, 2017</p>
							</div>
						</div>
					</div>



					<div>
						<div style={{backgroundColor: "#219286"}}>
							<div style={{display: "inline-flex", lineHeight: "18px", padding: "0.25rem"}}>
							  <p style={{paddingLeft: "0.25rem"}}>Origin</p>
							</div>
							<div style={{display:"grid"}}>
								<p style={{fontSize: "0.75rem"}}>09:45 HRS</p>
								<p style={{fontSize: "0.65rem"}}>Arrival</p>
							</div>
							<div style={{display:"grid"}}>
								<p style={{fontSize: "0.75rem"}}>09:55 HRS</p>
								<p style={{fontSize: "0.65rem"}}>Departure</p>
							</div>
						</div>
						<div style={{backgroundColor: "#219286"}}>
							<div style={{display: "inline-flex", lineHeight: "18px", padding: "0.25rem"}}>
							  <p style={{paddingLeft: "0.25rem"}}>1st Stop</p>
							</div>
							<div style={{display:"grid"}}>
								<p style={{fontSize: "0.75rem"}}>09:45 HRS</p>
								<p style={{fontSize: "0.65rem"}}>Arrival</p>
							</div>
							<div style={{display:"grid"}}>
								<p style={{fontSize: "0.75rem"}}>09:55 HRS</p>
								<p style={{fontSize: "0.65rem"}}>Departure</p>
							</div>
						</div>
						<div style={{backgroundColor: "#219286"}}>
							<div style={{display: "inline-flex", lineHeight: "18px", padding: "0.25rem"}}>
							  <p style={{paddingLeft: "0.25rem"}}>Destination</p>
							</div>
							<div style={{display:"grid"}}>
								<p style={{fontSize: "0.75rem"}}>09:45 HRS</p>
								<p style={{fontSize: "0.65rem"}}>Arrival</p>
							</div>
							<div style={{display:"grid"}}>
								<p style={{fontSize: "0.75rem"}}>09:55 HRS</p>
								<p style={{fontSize: "0.65rem"}}>Departure</p>
							</div>
						</div>
					</div>



					<div style={{float: "right", margin: "0px 0px 0px auto", width: "8rem", backgroundColor: "#3e5"}}>
						<div style={{display: "inline-flex", lineHeight: "18px", padding: "0.25rem"}}>
						  <p style={{paddingLeft: "0.25rem"}}>Caveats</p>
						</div>
						<div style={{display:"grid"}}>
							<p style={{fontSize: "0.75rem"}}>09:45 HRS</p>
							<p style={{fontSize: "0.65rem"}}>Wait Time</p>
						</div>
						<div style={{display:"grid"}}>
							<p style={{fontSize: "0.75rem"}}>09:45 HRS</p>
							<p style={{fontSize: "0.65rem"}}>Wait Time</p>
						</div>
					</div>
					<div style={{float: "right", margin: "0px", width: "8rem"}}>
						<div style={{backgroundColor: "#424242", padding: "0.5rem", position: "relative", height: "70%"}}>
							<p className="totalduration">09:45 HRS</p>
						</div>
						<div style={{backgroundColor: "#757575", padding: "0.5rem", position: "relative", height: "30%"}}>
							<p className="direct">DIRECT</p>
						</div>
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
				<div>
					{this.combineResults()}
				</div>
			</div>
		);
	}
}

export default SearchResults;