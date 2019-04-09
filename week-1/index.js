const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
var http = require('http').Server(app)
var io = require('socket.io')(http)
const request = require('request');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
		bier(msg);
	});
});

console.log(bier("bier"))

async function bier(msg) {
	let message = msg.split(" ")
	console.log(message);
	if(message.includes("bier")){
		function callback(error, response, body){
			let bier = JSON.parse(body).isBeerTime;
			console.log(bier);
			if(bier === false){
				console.log("joe");
				io.emit('chat message', "nee");
			}else{
				io.emit('chat message', "ja");
			}
		}
		request({url: 'https://ishetaltijdvooreen.pils.ski/api/time/check/11:35'}, callback);
	}
}

http.listen(3000, function() {
	console.log('listening on *:3000');
});
