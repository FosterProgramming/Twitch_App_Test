var Show_Timer = 15000
var Name_Timer = 30000

function adjustSize(width, height) {
	console.log(width, height)
	if (width / height > 800 / 600) {
		height = Math.floor(height * 600 / width)
		width = 800
	} else {
		width = Math.floor(width * 800 / height)
		height = 600
	}
	var top = (600 - height) / 2
	var left = (800 - width) / 2

	var img = document.getElementById("cat_picture")
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
		var img = document.getElementById("cat_picture")
    	img.src = data[0]["url"]
    	adjustSize(data[0]["width"], data[0]["height"])
  	})
  	.catch(error => {
		console.error('Error when getting user id:', error);
	});
}

export function nameACat() {
	window.cat_timer = Date.now() + Name_Timer
	window.message_callbacks.push((event, message) => {countNames(event, message)})
	window.cat_names = {}
	//window.cat_names_count = {}
	window.keep_picture = true
	setTimeout(endName, Name_Timer)
}

function countNames(event, message) {
	var author = event["chatter_user_id"]
	message = message.toLowerCase()
	if (!message.startsWith("!name")) {
		return
	}
	message = message.replace(/^!name +/, '');
	/*
	if (author in window.cat_names) {
		window.cat_names_count[window.cat_names[author]] -= 1
	}
	if (!(message in window.cat_names_count)) {
		window.cat_names_count[message] = 0
	}
	window.cat_names_count[message] += 1
	*/
	window.cat_names[author] = message
}

function endName() {
	var all_names = {}
	for (const [author, message] of Object.entries(window.cat_names)) {
		if (!(message in all_names)) {
			all_names[message] = 0
		}
		all_names[message] += 1
	
	}
	var votes = []
	for (const [name, score] of Object.entries(all_names)) {
		votes.push([name, score])
	}
	votes.sort((a, b) => {return (b[1] - a[1])})
	makeDivName(votes[0])
	setTimeout(closeName, 60000)
}

function makeDivName(best_vote) {
	var name = best_vote[0]
	name = name[0].toUpperCase() + name.slice(1)
	console.log(name)
	var div = document.createElement("div")
	div.id = "cat_name"
	div.className = "cat_name"
	div.textContent = name
	document.getElementById("cat").appendChild(div)
}

function closeName() {
	document.getElementById("cat_name").remove()
	window.keep_picture = false
	hideCat()
}

export function showCat() {
	if (!("cat_timer" in window)) {
		window.cat_timer = Date.now() - 1000 * 1000
	}
	console.log(window.cat_timer)
	if (window.cat_timer < Date.now()) {
		var img = document.getElementById("cat_picture")
		img.style.display = "block"
		setTimeout(hideCat, Show_Timer)
		window.cat_timer = Date.now() + Show_Timer
	}
}

function hideCat() {
	if (window.keep_picture) {
		return
	}
	var img = document.getElementById("cat_picture")
	img.style.display = "none"
	loadCatPicture()
}