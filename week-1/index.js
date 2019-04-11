const express = require('express')
const app = express()
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
			messages.forEach(function(element) {
			  io.to(socket.id).emit('chat message', element)
			});
		})
	socket.on('chat message', function(msg) {
		msg.name = socket.userName;
		socket.broadcast.emit('chat message', msg);
		bier(msg);
		messages.push(msg)
	});
	socket.on('disconnect', function() {
		console.log('user disconnected');
		users.count--
			console.log(users.count);
	});
	console.log(users.count);
});

async function bier(msg) {
	let message = msg.message.split(" ")
	if (message.includes("bier") || message.includes("bier?")) {
		function callback(error, response, body) {
			let data = JSON.parse(body);
			console.log(data);
			if (data.isBeerTime === false) {
				io.emit('chat message', {
					message: "nee sorry man nog:   " + data.duration.hours + ":" + data.duration.minutes,
					img: data.imagePath,
					name: "BierBot"
				});
			} else {
				io.emit('chat message', {
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

http.listen(3000, function() {
	console.log('listening on *:3000');
});
