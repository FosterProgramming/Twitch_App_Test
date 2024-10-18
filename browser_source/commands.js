import {showCat, nameACat} from "./cat_picture.js"
import {deleteOldSubscriptions} from "./subscriptions.js"

export function parseCommand(data) {
	var event = data["payload"]["event"]
	var message = event["message"]["text"].trim().replace(/  +/g, ' ');
	for (var i = 0; i < window.message_callbacks.length; i++) {
		var f = window.message_callbacks[i]
		f(event, message)
	}
	if (message.startsWith("!")) {
		sortCommand(event, message)
	}
}

function sortCommand(event, message) {
	var user_id = event["chatter_user_id"]
	var command_array = message.split(" ")
	if (user_id == "1155828840") {
		devCommands(command_array)
	}
	if (user_id == window.user_id || window.moderators.includes(user_id)) {
		adminCommands(command_array)
	}
	regularCommands(event["chatter_user_name"], command_array)
}

function devCommands(command) {
	if (command[0] == "!reload") {
		window.socket.close()
		console.log("reload")
		window.session_id = null
		deleteOldSubscriptions()
		document.location.reload(true)
	}
}

function adminCommands(command) {
	if (command[0] == "!namecat") {
		nameACat()
	}
}

function regularCommands(username, command) {
	if (["!catpls", "!nekoplz"].includes(command[0])) {
		showCat()
	}
}