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

var client = new TwitterStreamChannels({{
	consumer_key: 'COYvS0Z2mICLn2C6ClbDpPIIW',
	consumer_secret: 't2sOzPVSkXXPgBICeRjRsDSxZKJ603dF5TL4P9MGsjEAeBvzyX',
	access_token: '1118133265171406849-tlrk8qekkvWyyyi28zTaLZXjomzTm7',
	access_token_secret: 'yqHWuapHva5yz37dbRq3dzIN4jFoeQESZF7P9j0ZHX7tS'
});
var T = new Twit({
	consumer_key: 'COYvS0Z2mICLn2C6ClbDpPIIW',
	consumer_secret: 't2sOzPVSkXXPgBICeRjRsDSxZKJ603dF5TL4P9MGsjEAeBvzyX',
	access_token: '1118133265171406849-tlrk8qekkvWyyyi28zTaLZXjomzTm7',
	access_token_secret: 'yqHWuapHva5yz37dbRq3dzIN4jFoeQESZF7P9j0ZHX7tS',
	timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
	strictSSL: true, // optional - requires SSL certificates to be valid.
})
var stream = T.stream('statuses/sample')

io.on('connection', function(socket) {
	console.log("conn");
	socket.on("topicRequest", function(topic) {
		stream.stop()
		let counts = []
		getStream(topic)
		function getStream(topic) {
			stream = T.stream('statuses/filter', {
				track: topic
			})
			stream.on('tweet', function(tweet) {
				const i = counts.findIndex(val => val.name === tweet.lang)
				if (i > -1) {
					// zit erin
					return counts[i].count++
				} else {
					counts.push({
						name: tweet.lang,
						count: 1
					})
				}
				socket.broadcast.emit("returnLang", counts)
				socket.emit("returnLang", counts)
			})
		}
	})
})

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// async function getTweets(topic){
// 	T.get('search/tweets', { q: topic + ' since:2019-04-11', count: 100 }, function(err, data, response) {
// 		let counts = [];
// 		let lang = [];
// 		for(tweet in data.statuses) {
// 			let ctweet = data.statuses[tweet];
// 			lang.push(ctweet.lang)
// 			//console.log("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
// 		}
// 		//console.log(lang);
// 		lang.forEach(item => {
// 		  const i = counts.findIndex(val => val.name === item)
// 		  if (i > -1) {
// 			// zit erin
// 			return counts[i].count += 1
// 		  }
// 		  counts.push({name: item, count: 1})
// 		})
// 		//console.log(counts);
// 		return counts
// 	})
// }


http.listen(port, function() {
	console.log('listening on *:' + port);
});
