var express = require('express');
var app = express();

app.listen(process.env.PORT || 5000, function() {
    console.log('Server started...');
});

app.get('/*', function(req, res) {
	var param = req.params[0];
	var luckyNum = (Math.random() * 5 + 1).toFixed(0);
    var jsonResponse = [];
    jsonResponse.push({ "text": `Hi ${param}. ${luckyNum} is your lucky number...` });
    res.send(jsonResponse);
});


var http = require("http");
setInterval(function() {
    http.get("https://fb-pab.herokuapp.com");
}, 300000); // every 5 minutes (300000)