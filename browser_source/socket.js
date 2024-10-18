import {makeSubscription} from './subscriptions.js'
import {parseCommand} from './commands.js'
import {SOCKET_URL} from "../variables.js"

export function startSocket(url = SOCKET_URL, retry_time = 10000) {
	window.socket = new WebSocket(SOCKET_URL);
	console.log("open socket")
	window.socket.onmessage = (event) => {
	  readSocket(JSON.parse(event.data))
	};
	window.socket.onerror = (event) => {
	  manageSocketError(event, retry_time)
	};
}

function  manageSocketError(event, retry_time) {
	//let message = event.message
	console.log("WebSocket error");
	if (window.socket.readyState < WebSocket.CLOSING) {
		window.socket.close()
	}
	setTimeout(() => {startSocket(SOCKET_URL, retry_time * 2)}, 10000)
}

function readSocket(data) {
	var type = data["metadata"]["message_type"]
	if (type == "session_welcome") {
		var need_subscription = welcomeSession(data)
		if (need_subscription) {
			makeSubscription()
		}
	} else if (type == "notification") {
		console.log(data["payload"]["event"])
		updateDeathTimer()
		parseCommand(data)
	} else if (type == "session_keepalive") {
		updateDeathTimer()
	} else if (type == "session_reconnect") {
		console.log(data)
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
	window.keepalive_timeout = data["payload"]["session"]["keepalive_timeout_seconds"] * 1000
	updateDeathTimer()
	window.interval_id = setInterval(checkAlive, window.keepalive_timeout)
	return (window.session_id !== old_session)
}

function checkAlive() {
	var now = Date.now()
	if (now > window.death_timer || window.socket == "CLOSED") {
		console.log("websocket closed")
		clearInterval(window.interval_id);
		if (window.socket.readyState < WebSocket.CLOSING) {
			window.socket.close()
		}
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