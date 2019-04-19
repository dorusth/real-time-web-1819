const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000;
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
var http = require('http').Server(app)
var io = require('socket.io')(http)
const request = require('request');



app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});


http.listen(port, function() {
	console.log('listening on *:' + port);
});
