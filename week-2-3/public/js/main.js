(function() {
	let user
	let socket = io();
	document.querySelector('form.topic').addEventListener('submit', function(e) {
		e.preventDefault();
		let value = e.srcElement.childNodes[1].value;
		console.log(value);
		socket.emit('topicRequest', value);
	});

	socket.on("returnLang", function(data) {
		//console.log(data);
		draw(data);
	})
})()

function draw(tweetData) {
	tweetData.sort((a, b) => (a.count < b.count) ? 1 : -1)
	console.log(tweetData);
	let names = []
	let counts = []
	for (item in tweetData) {
		names.push(tweetData[item].name)
		counts.push(tweetData[item].count)
	}

	var data = {
		labels: names,
		series: counts
	};

	var options = {
		width: 600,
		height: 400,
		distributeSeries: true
	};

	
	new Chartist.Bar('.ct-chart', data, options);
}
