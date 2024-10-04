import {makeSubscription} from './subscriptions.js'
import {parseCommand} from './commands.js'

var SOCKET_URL = "wss://eventsub.wss.twitch.tv/ws"

export function startSocket() {
	window.socket = new WebSocket(SOCKET_URL);
	console.log("open socket")
	window.socket.onmessage = (event) => {
	  readSocket(JSON.parse(event.data))
	};
}

function readSocket(data) {
	console.log(data)
	var type = data["metadata"]["message_type"]
	if (type == "session_welcome") {
		var need_subscription = welcomeSession(data)
		if (need_subscription) {
			makeSubscription()
		}
	} else if (type == "notification") {
		updateDeathTimer()
		parseCommand(data)
	} else if (type == "session_keepalive") {
		updateDeathTimer()
	} else if (type == "session_reconnect") {
		var new_url = data["payload"]["reconnect_url"]
		startSocket(new_url)
	} else {
		console.log(data);
	}
}





function updateDeathTimer() {
	window.death_timer = Date.now() + window.keepalive_timeout
}
function welcomeSession(data) {
	var old_session = window.session_id
	window.session_id = data["payload"]["session"]["id"]
	window.keepalive_timeout = data["keepalive_timeout_seconds"] * 1000
	updateDeathTimer()
	setInterval(checkAlive, window.keepalive_timer)
	return (window.session_id !== old_session)
}

function checkAlive() {
	var now = Date.now()
	if (now > window.death_timer) {
		console.log("websocket closed")
		window.socket.close()
		startSocket()
	}
}

function addChatMessage(author, msg) {
	var parent = document.getElementById("chat")
	var text = author + ": " + msg
	var div = document.createElement("div")
	div.className = "chat_msg"
	div.textContent = text
	parent.appendChild(div)
}