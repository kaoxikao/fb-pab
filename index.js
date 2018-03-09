var express = require('express');
var app = express();
var moment = require('moment');

app.listen(process.env.PORT || 5000, function() {
    console.log('Server started...');
    console.log('on port ' + (process.env.PORT || 5000) + ', on ' + moment().format('Do MMM YYYY, HH:mm:ss') );
});

app.get('/*', function(req, res) {
	var param = req.params[0];
	var luckyNum = (Math.random() * 5 + 1).toFixed(0);
    var jsonResponse = [];
    jsonResponse.push({ "text": `Hi ${param}. ${luckyNum} is your lucky number...` });
    res.send(jsonResponse);
});


var http = require("https");
setInterval(function() {
    http.get("https://fb-pab.herokuapp.com", function (res){
    	console.log("Ping at " + moment().format('Do MMM YYYY, HH:mm:ss') );
    });

}, 300000); // every 5 minutes (300000)