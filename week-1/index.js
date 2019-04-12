const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000;
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
var http = require('http').Server(app)
var io = require('socket.io')(http)
const request = require('request');

app.use(express.static('public'))

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

let users = {}
users.count = 0
let messages = []

io.on('connection', function(socket) {
	users.count++
		socket.on('name change', function(name) {
			socket.userName = name;
			msg = {message: "Has joined the room", name:socket.userName}
			messages.push(msg)
			socket.broadcast.emit('chatMessage', msg);
			messages.forEach(function(element) {
			  io.to(socket.id).emit('chatMessage', element)
			});
		})
	socket.on('chat message', function(msg) {
		msg.name = socket.userName;
		socket.broadcast.emit('chatMessage', msg);
		socket.emit('chatMessage', msg);
		bier(msg);
		messages.push(msg)
	});
	socket.on("typing", function(){
		if(socket.typing === false || !socket.typing){
			socket.typing = true
			socket.broadcast.emit('typing', socket.userName);
		}
	})
	socket.on("typingEnd", function(){
		socket.typing = false
		socket.broadcast.emit('typingEnd');
	})
	socket.on('disconnect', function() {
		console.log('user disconnected');
		users.count--
	});
});

async function bier(msg) {
	let message = msg.message.split(" ")
	if (message.includes("bier") || message.includes("bier?")) {
		function callback(error, response, body) {
			let data = JSON.parse(body);
			if (data.isBeerTime === false) {
				io.emit('chatMessage', {
					message: "nee sorry man nog:   " + data.duration.hours + ":" + data.duration.minutes,
					img: data.imagePath,
					name: "BierBot"
				});
			} else {
				io.emit('chatMessage', {
					message: "ja"
				});
			}
		}
		request({
			url: 'https://ishetaltijdvooreen.pils.ski/api/time/check/' + msg.time + "?withImage",
			headers: {
				Authorization: `Bearer fec94af315f3296dc4cac3f224480f2b`
			}
		}, callback);
	}
}

http.listen(port, function() {
	console.log('listening on *:' + port);
});
