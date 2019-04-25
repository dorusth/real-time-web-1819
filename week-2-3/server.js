const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000;
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const http = require('http').Server(app)
const io = require('socket.io')(http)
var TwitterStreamChannels = require('twitter-stream-channels');
const Twit = require('twit')

app.use(express.static('public'))

var client = new TwitterStreamChannels({
	consumer_key: 'COYvS0Z2mICLn2C6ClbDpPIIW',
	consumer_secret: 't2sOzPVSkXXPgBICeRjRsDSxZKJ603dF5TL4P9MGsjEAeBvzyX',
	access_token: '1118133265171406849-tlrk8qekkvWyyyi28zTaLZXjomzTm7',
	access_token_secret: 'yqHWuapHva5yz37dbRq3dzIN4jFoeQESZF7P9j0ZHX7tS'
});


var channels = {
	// "test": "test"
};
var stream = false

var data = {}

io.on('connection', function(socket) {
	socket.on("topicRequest", function(topic) {
		if(!socket.topic){
			socket.topic = topic
		}else{
			socket.leave(socket.topic);
			socket.topic = topic
		}
		if (channels[topic]) {
			console.log("joe");
			socket.join(topic)
		} else {
			channels[topic] = topic
			data[topic] = []
			socket.join(topic)
			if(stream != false){
				stream.stop();
			}
			stream = client.streamChannels({
				track: channels
			});
			makeStream(topic)
			stabilize();
		}
	})

	function stabilize() {
		let toStabalize = Object.keys(channels)
		toStabalize.forEach(function(topic) {
			console.log("channel: " + topic);
			console.log(data[topic]);
			stream.on('channels/' + topic, function(tweet) {
				let langs = []
				data[topic].forEach(function(entry){
					langs.push(entry.lang);
				})
				if(langs.includes(tweet.lang)){
					data[topic].find(x => x.lang === tweet.lang).count++;
				}else{
					data[topic].push({
						lang: tweet.lang,
						count: 1
					})
				}
				io.to(topic).emit('returnLang', data[topic]);
			});
		})
	}

	function makeStream(topic) {
		io.to(topic).emit('roomJoin');
		io.to(topic).emit('returnLang', data[topic]);//de grafiek vast renderen voor percieved performance voordat er tweets zijn
		stream.on('channels/' + topic, function(tweet) {
			let langs = []
			data[topic].forEach(function(entry){
				langs.push(entry.lang);
			})
			if(langs.includes(tweet.lang)){
				data[topic].find(x => x.lang === tweet.lang).count++;
			}else{
				data[topic].push({
					lang: tweet.lang,
					count: 1
				})
			}
			io.to(topic).emit('returnLang', data[topic]);
		});
	}

	function joinRoom(topic) {
		socket.join(topic)
		io.to(topic).emit('roomJoin');
	}

	socket.on('disconnect', function() {
		//console.log(socket.topic);
		//console.log(io.sockets.adapter.rooms[socket.topic[0]]);
		// if(io.sockets.adapter.rooms[socket.topic[0]]){
		// 	delete channels[socket.topic[0]]
		// 	stream.stop();
		// 	stream = client.streamChannels({
		// 		track: channels
		// 	});
		// }
	})
})

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
	console.log('listening on *:' + port);
});
