var express = require('express');
var app = express();

app.listen(process.env.PORT || 5000, function() {
    console.log('Chatfuel Bot-Server listening...');
});

app.get('/*', function(req, res) {
    var jsonResponse = [];
    jsonResponse.push({ "text": "Hi. " + (Math.random() * 5 + 1).toFixed(0) + " is a lucky number..." });
    res.send(jsonResponse);
});
