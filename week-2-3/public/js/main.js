(function() {
	let user
	let socket = io();
	document.querySelector('form.topic').addEventListener('submit', function(e) {
		e.preventDefault();
		let value = e.srcElement.childNodes[1].value;
		console.log(value);
		let filters = ["", " ","   "]
		if(filters.includes(value)){
			console.log("optyfen");
		}else{
			socket.emit('topicRequest', value);
		}
	});

	socket.on("returnLang", function(data) {
		//console.log(data);
		draw(data);
	})

	socket.on("roomJoin", function(data) {
		console.log("joined");
	})

function draw(tweetData) {
	tweetData.sort((a, b) => (a.count < b.count) ? 1 : -1)
	console.log(tweetData);
	let names = []
	let counts = []
	for (item in tweetData) {
		names.push(tweetData[item].lang)
		counts.push(tweetData[item].count)
	}

	var data = {
		labels: names,
		series: counts
	};

	var options = {
		height: 600,
		distributeSeries: true
	};

	new Chartist.Bar('.ct-chart', data, options);

	document.querySelector(".list").innerHTML = ``;
	let langlist = tweetData.map(lang =>{
		return(`<li>${lang.lang}:${lang.count} </li>`)
	})
	document.querySelector(".list").innerHTML = langlist.join('');
}


})()
