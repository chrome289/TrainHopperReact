const express = require('express');
const morgan = require('morgan');
const path = require('path');
var bodyParser = require('body-parser');

var mysql = require('mysql');
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

function direct(city1, city2, day, callback) {
    var classSearch = ''

    var date=new Date(day)
    day=dayArr[date.getDay()]
    var queryString = "select a.train_id,a.train_name,TIME_TO_SEC(a.departure),TIME_TO_SEC(b.arrival),TIME_TO_SEC(b.arrival)+((b.arr_day-a.arr_day) *86400)-TIME_TO_SEC(a.departure) AS timeDef from project.train a INNER JOIN project.train as b where a.train_id=b.train_id AND b.station_id=\""+city2+"\" AND a.station_id=\""+city1+"\" AND a.sno<b.sno AND (a.schedule LIKE '%Daily%' OR a.schedule LIKE '%"+day+"%') AND (a.route_no=b.route_no OR a.route_no=0) "+classSearch+" ORDER by a.train_id";
    console.log(queryString)
    connection.query( queryString, function(err, rows,fields){
    if(err){
        console.log(err+"\n\n"+queryString);
        callback('error '+err);
    }
    else{
        if(rows.length!=0){
            console.log('City 1 is ' + city1 + ' City 2 is ' + city2)
            temp=[]
            for(x=0;x<rows.length;x++) {
                console.log(rows[x]);
                temp.push({
                    train_id:rows[x].train_id,
                    train_name:rows[x].train_name,
                    total_duration:rows[x].timeDef,
                    arrival:rows[x]['TIME_TO_SEC(b.arrival)'],
                    departure:rows[x]['TIME_TO_SEC(a.departure)'],
                });
            }
            console.log(temp);
            callback(temp);
        }
        else{
            console.log('No Result')
            callback([]);
        }
    }
  });
}

module.exports = app;