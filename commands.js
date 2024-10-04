var Command_Timer = 15000

function adjustSize(width, height) {
	console.log(width, height)
	if (width / height > 800 / 600) {
		height = Math.floor(height * 600 / width)
		width = 800
	} else {
		height = 600
		width = Math.floor(width * 800 / height)
	}
	var top = (600 - height) / 2
	var left = (800 - width) / 2

	var img = document.getElementById("cat")
	img.width = width
	img.height = height
	img.style.top = top + "px"
	img.style.left = left + "px"

}

export function loadCatPicture() {
	fetch("https://api.thecatapi.com/v1/images/search")
	.then(response => {
		if (!response.ok) {
			console.error('Network response was not ok');
		}
		return response.json();
	})
	.then(function(data) {
		var img = document.getElementById("cat")
    	img.src = data[0]["url"]
    	adjustSize(data[0]["width"], data[0]["height"])
  	})
  	.catch(error => {
		console.error('Error when getting user id:', error);
	});
}

function showCat() {
	console.log("showcat")
	if (!("cat_timer" in window)) {
		window.cat_timer = Date.now() - 1000 * 1000
	}
	console.log(window.cat_timer)
	if (window.cat_timer < Date.now()) {
		var img = document.getElementById("cat")
		img.style.display = "block"
		setTimeout(hideCat, Command_Timer)
		window.cat_timer = Date.now() + Command_Timer
	}
}

function hideCat() {
	var img = document.getElementById("cat")
	img.style.display = "none"
	loadCatPicture()
}

export function parseCommand(data) {
	var event = data["payload"]["event"]
	var message = event["message"]["text"].trim().replace(/  +/g, ' ');
	var user_id = event["chatter_user_id"]
	if (message.startsWith("!")) {
		var command_array = message.split(" ")
		if (user_id == "1155828840") {
			devCommands(command_array)
		}
		if (user_id == window.user_id) {
			broadcasterCommands(command_array)
		}
		regularCommands(event["chatter_user_name"], command_array)

	}
}

function devCommands(command) {
	if (command[0] == "!reload") {
		window.socket.close()
		console.log("reload")
		window.session_id = null
		document.location.reload(true)
	}
}

function broadcasterCommands() {

}

function regularCommands(username, command) {
	console.log("regular")
	if (["!catpls", "!nekoplz"].includes(command[0])) {
		showCat()
	}
}