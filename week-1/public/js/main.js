(function() {
	let user
	let socket = io();
	document.querySelector('form.message-input').addEventListener('submit', function(e) {
		e.preventDefault();
		let today = new Date();
		let hours = ()=>{if(today.getHours()<10){return "0"+today.getHours()}else{return today.getHours()}}
		let minutes = ()=>{if(today.getMinutes()<10){return "0"+today.getMinutes()}else{return today.getMinutes()}}
		let time = hours() + ":" + minutes();
		let data = {
				message: document.querySelector('#m').value,
				time: time
		}
		socket.emit('chat message', data);
		document.querySelector('#m').value = "";
		return false;
	});

	document.querySelector('form.message-input').addEventListener('input', function(e) {
		socket.emit("typing");
		let timeoutID = window.setTimeout(typeEnd, 2000);
		function typeEnd(){
			socket.emit("typingEnd");
		}
	})

	socket.on('chatMessage', function(msg) {
		let newLi = document.createElement("li")
		let messageUser = document.createElement("span")
		messageUser.classList.add("message-user")
		let message =  document.createTextNode(msg.message)
		let userName = document.createTextNode(msg.name + ":  ")
		let timestamp = document.createElement("span")
		timestamp.textContent = msg.time || "";
		timestamp.classList.add("timestamp")

		messageUser.append(userName)
		newLi.append(messageUser)
		newLi.append(message)
		if(msg.img){
			let newImg = document.createElement("img")
			newImg.src = "https://ishetaltijdvooreen.pils.ski" + msg.img
			newLi.append(newImg)
		}
		newLi.append(timestamp)

		document.querySelector('#messages').append(newLi);
	});
	document.querySelector('.userName').addEventListener('submit', function(e){
		e.preventDefault();
		socket.emit('name change', e.srcElement.childNodes[0].value);
		user = e.srcElement.childNodes[0].value;
		e.target.remove();
		document.querySelector('#m').disabled = false;
		document.querySelector('#m').focus();
	})
	socket.on("typing", function(name){
		document.querySelector(".typing").textContent = name + " is typing..."
	})
	socket.on("typingEnd", function(){
		document.querySelector(".typing").textContent = ""
	})
})()
