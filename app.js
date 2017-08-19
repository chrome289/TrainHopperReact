const express = require('express');
const morgan = require('morgan');
const path = require('path');
var bodyParser = require('body-parser');
const NodeCache = require('node-cache');

var mysql = require('mysql');

const cacheInstance = new NodeCache();
var connection = mysql.createConnection(
		{
			host     : 'localhost',
			user     : 'root',
			password : '28julius9',
			database : 'project',
		}
);

const app = express();


// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Serve static assets
app.use(express.static(path.resolve(__dirname,'reacthopper', 'build')));

connection.connect();

var nextQueryID = 0;
connection.query("SELECT MAX(queryID) as max_queryID FROM past_queries", function(err, rows, fields){
	if(err)
		console.log(err)
	else{
		if(rows[0].max_queryID == null)
			nextQueryID = 0
		else
			nextQueryID = rows[0].max_queryID;
		console.log("current queryID is " + nextQueryID);
	}
});

var city1="",city2="",day=""
var dayArr=['SUN','MON','TUE','WED','THU','FRI','SAT']
app.use(bodyParser.urlencoded({ extended: true })); 

// Always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'reacthopper', 'build', 'index.html'));
});

app.get('/results', function(req, res) {
	 FROM = req.query.from.toUpperCase();
	 TO = req.query.to.toUpperCase();
	 DATE = req.query.date;
	 direct(FROM, TO, DATE, function (direct_result) {
		 var result = direct_result
		 result.sort(function (a,b) {
			 return a.total_duration - b.total_duration;
			});
		for (var i = result.length - 1; i >= 0; i--) {
			result[i].departure = parseInt(result[i].departure/3600) + ':' + parseInt(result[i].departure/60%60)
			result[i].arrival = parseInt(result[i].arrival/3600) + ':' + parseInt(result[i].arrival/60%60)
			result[i].total_duration = parseInt(result[i].total_duration/3600) + ':' + parseInt(result[i].total_duration/60%60)
		}
		console.log('results '+result.length)
 
		res.setHeader('Content-Type', 'application/json');
		res.status(200).json({
			result: result, 
			from: FROM, 
			to: TO,
			date: DATE
		});
	});
});

app.post('/paginationdroid', function(req, res){
	var queryID = req.body.queryID;
	var page = req.body.page;
	cacheInstance.get(queryID, function( err, value){
		if(err){
			console.log(err);
		}else if(value != undefined){
			var result= JSON.parse(JSON.stringify(value))
			//console.log('pagination initial' +JSON.stringify(result)+' for '+queryID)
			console.log('result length '+ result.length)
			tenresult = [];
			for (var x = (10*page),y=0; x < ((10*page)+10),y<10; x++,y++) {
				if (x < result.length){
					tenresult[y] = result[x];
				}
			}
			console.log('pagination page no. '+ page +' for '+queryID)
			res.setHeader('Content-Type', 'application/json');
			res.status(200).send(JSON.stringify(tenresult));		
		}else{
			console.log('cache data not available for queryID '+queryID);
			connection.query("SELECT * FROM past_queries WHERE queryID = "+queryID, function(err, rows, fields){
				if(err)
					console.log(err);
				else{
					search(rows[0].from, rows[0].to, rows[0].date, rows[0].time, rows[0].classes, rows[0].isDirect, 1, queryID, function(tenresult){
						res.setHeader('Content-Type', 'application/json');
						res.status(200).send(JSON.stringify(tenresult));
					});
				}
			});
		}
	})
});

app.post('/resultsdroid', function (req, res) {

		const FROM = req.body.from.toUpperCase();
		const TO = req.body.to.toUpperCase();
		const DIRECT = req.body.direct;
		const CLASSES = req.body.classes;
		const SORT = req.body.sort;

		var tempDate = new Date(Number(req.body.time));
		console.log(tempDate+"***"+tempDate.getFullYear()+ "***"+req.body.time);
		const DATE = tempDate.getFullYear()+"-"+(tempDate.getMonth()+1)+"-"+(tempDate.getDate()+1);
		const TIME = ((tempDate.getHours()+1)*3600)+((tempDate.getMinutes()+1)*60);

		console.log('Request for '+ FROM+','+ TO+','+ DATE+','+ tempDate.getFullYear()+','+ SORT);

		nextQueryID++;
		finalResult=[];
		search(FROM, TO, DATE, TIME, CLASSES, DIRECT, SORT, nextQueryID, function(tenresult){
			finalResult.push({
				result: tenresult,
				queryID: nextQueryID,
			})
			res.setHeader('Content-Type', 'application/json');
			res.status(200).send(JSON.stringify(finalResult));
		});		
});

function search(FROM, TO, DATE, TIME, CLASSES, DIRECT, SORT,nextQueryID, callback){
	var classSearch = ' AND ('
		if (CLASSES.indexOf('a1') != -1)
				classSearch = classSearch + "a.class LIKE '%1A%' OR "
		if (CLASSES.indexOf('a2') != -1)
				classSearch = classSearch + "a.class LIKE '%2A%' OR "
		if (CLASSES.indexOf('a3') != -1)
				classSearch = classSearch + "a.class LIKE '%3A%' OR "
		if (CLASSES.indexOf('cc') != -1)
				classSearch = classSearch + "a.class LIKE '%CC%' OR "
		if (CLASSES.indexOf('s2') != -1)
				classSearch = classSearch + "a.class LIKE '%2S%' OR "
		if (CLASSES.indexOf('sl') != -1)
				classSearch = classSearch + "a.class LIKE '%SL%' OR "
		if (CLASSES.indexOf('e3') != -1)
				classSearch = classSearch + "a.class LIKE '%3E%' OR "
		if (CLASSES.indexOf('fc') != -1)
				classSearch = classSearch + "a.class LIKE '%FC%' OR "
		if (CLASSES.indexOf('gen') != -1)
				classSearch = classSearch + "a.class LIKE '%UNRESERVED%' OR a.class LIKE '%GN%' OR "
		classSearch = classSearch.substring(0, classSearch.length - 4) + ')'

	direct(FROM, TO, DATE, TIME, classSearch, function (direct_result) {
		indirect(FROM, TO, DATE, TIME, classSearch, DIRECT, function (indirect_result) {
			result = direct_result.concat(indirect_result);
						//console.log('final result  '+result)
			if (result.length != 0) {
				//filter unrealistic routes
				result.sort(function (a, b) {
					return a.total_duration - b.total_duration;
				});

				var tenresult = [];
				for (var x = 0; x < 50; x++) {
					if (x < result.length)
						tenresult[x] = result[x];
				}
				result = tenresult

				var tempresult = [];
				var t = 0;
				for (var i = 0; i < result.length; i++) {
					if ((result[i].leg)[0].arrival_start >= TIME) {
						tempresult[t] = result[i];
						tempresult[t].wait_time = parseInt((result[i].leg)[0].arrival_start) - parseInt(TIME)
						if((result[i].leg).length>1)
							tempresult[t].layoverd = parseInt(result[i].total_duration-(((result[i].leg)[0].duration)+(result[i].leg)[1].duration));
						else
							tempresult[t].layoverd = parseInt(0);
						t++;
					}
				}
		
				result = tempresult;

				if (SORT == "1") {
					result.sort(function (a, b) {
						return a.total_duration - b.total_duration;
					});
				}
				else if (SORT == "2") {
					console.log('sort 2');
					result.sort(function (a, b) {
						if ((a.leg)[0].arrival_start == (b.leg)[0].arrival_start)
							return a.total_duration - b.total_duration;
						else
							return (a.leg)[0].arrival_start - (b.leg)[0].arrival_start;
					});
				}
				else if (SORT == "3") {
					console.log('sort 3');
					result.sort(function (a, b) {
						if (parseInt((a.leg)[a.leg.length - 1].day_def) >= parseInt((b.leg)[b.leg.length - 1].day_def)) {
							if ((a.leg)[a.leg.length - 1].arrival_end == (b.leg)[b.leg.length - 1].arrival_end && a.day_def == b.day_def)
								return a.total_duration - b.total_duration;
							else
								return (a.leg)[a.leg.length - 1].arrival_end - (b.leg)[b.leg.length - 1].arrival_end;
						}
						else
							return false;
					});
				}
				else if (SORT == "4") {
					result.sort(function (a, b) {
						if (a.wait_time == b.wait_time)
							return a.total_duration - b.total_duration;
						else
							return a.wait_time - b.wait_time;
					});
				}
				else if (SORT == "5") {
					result.sort(function (a, b) {
						if (a.layoverd == b.layoverd)
							return a.total_duration - b.total_duration;
						else
							return a.layoverd - b.layoverd;
					});
				}
	
				const VALUES=[nextQueryID, FROM, TO, DATE, TIME, DIRECT, CLASSES];
				connection.query('SELECT * FROM past_queries WHERE queryID = ' + nextQueryID, function(err, rows, fields){
					if(err)
						console.log(err)
					else if(rows.length == 0){
						connection.query('INSERT INTO past_queries VALUES(?)', [VALUES], function(err, result2){
							if(err)
								console.log(err)
							else{
								console.log('query stored..now caching');
								cacheInstance.set(nextQueryID, result, function(err, success){
									if(err)
										console.log(err)
									else{
										console.log('query result cached');
										cacheInstance.get(nextQueryID, function(err, value){
											console.log('cached data for queryID '+nextQueryID);
										})
									}
								});
							}
						});
					}else{
						console.log('query already stored..now caching');
						cacheInstance.set(nextQueryID, result, function(err, success){
							if(err)
								console.log(err)
							else{
								console.log('query result cached');
								cacheInstance.get(nextQueryID, function(err, value){
									console.log('cached data for queryID '+nextQueryID);
								})
							}
						});
					}
				});
					
				tenresult = [];
				for (var x = 0; x < 10; x++) {
					if (x < result.length)
						tenresult[x] = result[x];
				}
			}
			callback(tenresult);
		});
	});	
}

function direct(city1, city2, day, time, classSearch, callback) {
	
	var date = new Date(day)
	day = dayArr[date.getDay()]
	var queryString = "select a.station_name as start,b.station_name as end,a.train_id,a.train_name,a.class"
		+",TIME_TO_SEC(a.arrival),TIME_TO_SEC(a.departure),TIME_TO_SEC(b.arrival),TIME_TO_SEC(b.departure)"
		+",TIME_TO_SEC(b.arrival)+((b.arr_day-a.arr_day) *86400)-TIME_TO_SEC(a.arrival) AS timeDef"
		+",(b.arr_day-a.arr_day) as dayDef from project.train a INNER JOIN project.train as b"
		+" where a.train_id=b.train_id AND b.station_id=\"" + city2 + "\" AND a.station_id=\"" + city1 + "\" AND a.sno<b.sno"
		+" AND a.arrival > "+time
		+" AND (a.schedule LIKE '%Daily%' OR a.schedule LIKE '%" + day + "%') AND (a.route_no=b.route_no OR a.route_no=0) " 
		+ classSearch + " ORDER by a.train_id";
	connection.query(queryString, function (err, rows, fields) {
		if (err) {
			console.log(err + "\n\n" + queryString);
			callback('error ' + err);
		}
		else {
			if (rows.length != 0) {
				temp = []
				for (x = 0; x < rows.length; x++) {
					tempA = ({
						train_id: rows[x].train_id,
						train_name: rows[x].train_name,
						train_class: rows[x].class,
						id_start: city1,
						id_end: city2,
						arrival_start: rows[x]['TIME_TO_SEC(a.arrival)'],
						departure_start: rows[x]['TIME_TO_SEC(a.departure)'],
						arrival_end: rows[x]['TIME_TO_SEC(b.arrival)'],
						departure_end: rows[x]['TIME_TO_SEC(b.departure)'],
						day_def: rows[x].dayDef,
						duration: rows[x].timeDef,
					});
					leg = []
					leg[0] = tempA;
					temp.push({
						leg: leg,
						total_duration: rows[x].timeDef,
					});
					//console.log("leg me up ::::::::"+(temp[0].leg)[0].train_id)
				}
				console.log('direct result '+temp);
				callback(temp);
			}
			else {
				//console.log('direct result '+temp);
				callback([]);
			}
		}
	});
}

function indirect(city1, city2, day, time, classSearch, direct, callback) {
	if(direct=='true')
		callback([]);
	else{
		
		temps = [],tempDuration=[]
		var date = new Date(day)
		day = dayArr[date.getDay()]
		var queryString = "SELECT DISTINCT a.station_id,b.station_name as start,a.train_id,a.train_name,a.class,a.schedule"
			+",TIME_TO_SEC(a.arrival),TIME_TO_SEC(a.departure),TIME_TO_SEC(b.arrival),TIME_TO_SEC(b.departure),TIME_TO_SEC(a.arrival) as arrivalCol"
			+",TIME_TO_SEC(a.arrival)+((a.arr_day-b.arr_day) *86400)-TIME_TO_SEC(b.arrival) AS timeDef"
			+",(a.arr_day-b.arr_day) as dayDef1 from project.train as a INNER JOIN(SELECT * from project.train"
			+" WHERE station_id=\"" + city1 + "\") as b"
			+" WHERE a.train_id=b.train_id AND a.sno>b.sno"
			+" AND b.arrival > "+time
			+" AND (b.schedule LIKE '%Daily%' OR b.schedule LIKE '%" + day + "%')"
			+"AND (a.route_no=b.route_no OR a.route_no=0)" + classSearch + "";
		console.log(queryString)
		connection.query(queryString, function (err, rows, fields) {
			if (err) {
				console.log(err + "\n\n-----" + queryString);
				callback('error ' + err)
			}
			else {
				var queryString2 = "SELECT DISTINCT a.station_name as mid,b.station_name as end,a.station_id,a.train_id,a.train_name,a.class,a.schedule"
					+",TIME_TO_SEC(a.arrival),TIME_TO_SEC(a.departure),TIME_TO_SEC(b.arrival),TIME_TO_SEC(b.departure)"
					+", TIME_TO_SEC(a.arrival) as arrivalCol,TIME_TO_SEC(b.arrival)+((b.arr_day-a.arr_day) *86400)-TIME_TO_SEC(a.arrival) AS timeDef"
					+",(b.arr_day-a.arr_day) as dayDef2"
					+" from project.train as a INNER JOIN(SELECT * from project.train"
					+" WHERE station_id=\"" + city2 + "\") as b"
					+" WHERE a.train_id=b.train_id AND a.sno<b.sno AND (a.route_no=b.route_no OR a.route_no=0)" + classSearch + "";
				connection.query(queryString2, function (err, rows2, fields) {
					if (err) {
						console.log(err + "\n\n-----" + queryString);
						callback('error ' + err)
					}
					else {
						var temp2 = 0, z = 0
						console.log(queryString2)
						for (x = 0; x < rows.length; x++) {
							for (y = 0; y < rows2.length; y++) {
								if (rows[x].station_id == rows2[y].station_id) {
										//layover               
									var totalTime = rows[x].timeDef + rows2[y].timeDef
									var day2 = dayArr[dayArr.indexOf(day) + rows[x].dayDef]
									if (rows2[y].schedule.indexOf('Daily') > -1) {
										if (rows[x].arrivalCol < rows2[y].arrivalCol) {
											totalTime = totalTime + (rows2[y].arrivalCol - rows[x].arrivalCol)
										}
										else {
											totalTime = totalTime + 86400 - (rows[x].arrivalCol - rows2[y].arrivalCol)
										}
									}
									else {
										temp2 = dayArr.indexOf(day2)
										z = temp2
										while (true) {
											if(rows2[y].schedule.indexOf(dayArr[z % 7]) > -1) {
												if (rows[x].arrivalCol < rows2[y].arrivalCol) {
													totalTime = totalTime + ((z - temp2) * 86400) + (rows2[y].arrivalCol - rows[x].arrivalCol)
												}
												else {
																	// console.log(totalTime+' '+z+'   '+temp2+'   '+rows[x].arrivalCol+'   '+rows2[y].arrivalCol)
													totalTime = totalTime + ((z - temp2 + 1) * 86400) - (rows[x].arrivalCol - rows2[y].arrivalCol)
												}
												break;
											}
											else {
												z++;
																							//console.log(dayArr[z%7]);
																							// console.log(rows2[y].train_id);
											}
										}
									}
																	// totalTime = parseInt(totalTime/60/60)+':'+parseInt(totalTime/60%60);
																	//a & b are reversed for some reason in the first query
									tempB = ({
										train_id: rows[x].train_id,
										train_name: rows[x].train_name,
										train_class: rows[x].class,
										day_def: rows[x].dayDef1,

										id_start: city1,
										id_end: rows[x].station_id,

										arrival_start: rows[x]['TIME_TO_SEC(b.arrival)'],
										departure_start: rows[x]['TIME_TO_SEC(b.departure)'],
										arrival_end: rows[x]['TIME_TO_SEC(a.arrival)'],
										departure_end: rows[x]['TIME_TO_SEC(a.departure)'],
										duration: rows[x].timeDef,
									});
									tempC = ({
										train_id: rows2[y].train_id,
										train_name: rows2[y].train_name,
										train_class: rows2[y].class,
										day_def: (+rows2[y].dayDef2) + (+rows[x].dayDef1),//unary conversion to nos

										id_start: rows[x].station_id,
										id_end: city2,

										arrival_start: rows2[y]['TIME_TO_SEC(a.arrival)'],
										departure_start: rows2[y]['TIME_TO_SEC(a.departure)'],
										arrival_end: rows2[y]['TIME_TO_SEC(b.arrival)'],
										departure_end: rows2[y]['TIME_TO_SEC(b.departure)'],
										duration: rows2[y].timeDef,
									});
									legs = []
									legs[0] = tempB;
									legs[1] = tempC;
									temps.push({
										leg: legs,
										total_duration: totalTime,
									})
								//console.log("leg me up ::::::::"+(temps[0].leg)[1].train_id)
								// console.log(rows[x].train_id+'    '+rows[x].station_id+'----------'+rows2[y].train_id+'    '+rows2[y].station_id+'    '+totalTime+'    '+z)
								}
							}
						}
						callback(temps);
					}
				});
			}
		});
	}
}

module.exports = app;