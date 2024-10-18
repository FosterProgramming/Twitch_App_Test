const scope_array = [
		"moderation:read",
		"user:read:chat"
	]

var client_ids = await getMockIdSecret()
var client_id = client_ids["ID"]
var client_secret = client_ids["Secret"]
var {broadcaster_id, users_id} = await getBroadcasterId(client_id, client_secret)
var token = await getMockToken(client_id, client_secret, broadcaster_id)
var url = makeUrl(client_id, token)
var {users_id, moderators_id} = await getModerators(broadcaster_id, client_id, users_id)

openTab(url)
setTimeout( () => {
launchChatEvent(users_id[0], "!catpls")
}, 5000)
//setTimeout(() => {testNames(users_id)}, 6000)
setTimeout(testReconnection, 30 * 1000)
setTimeout(testCrash, 60 * 1000)

function testReconnection() {
	twitchReconnect()
	setTimeout( () => {
		launchChatEvent(users_id[1], "!nekoplz")
	}, 5000)
}

function testCrash() {
	twitchCrash()
	setTimeout( () => {
		launchChatEvent(users_id[1], "!nekoplz")
	}, 30000)
}

async function twitchCrash() {
	var cmd = new Deno.Command("./scripts/restart_socket_server")
	await cmd.output()
}

function testNames(users_id) {
	launchChatEvent(moderators_id[0], "!namecat")
	setTimeout( () => {
		launchChatEvent(users_id[0], "!name kitty")
	}, 1000)
	setTimeout( () => {
		launchChatEvent(users_id[1], "!name kIttY")
	}, 1100)
	setTimeout( () => {
		launchChatEvent(users_id[2], "!name kitty2")
	}, 1200)
	setTimeout( () => {
		launchChatEvent(users_id[3], "!name kitty3")
	}, 1300)
	setTimeout( () => {
		launchChatEvent(users_id[1], "!name kIttY2")
	}, 1400)
}
function openTab(url) {
	let cmd = new Deno.Command("open", { args: ["-a", "Google Chrome", url] });
	cmd.output()
}

async function launchChatEvent(user_id, message) {
	var params = {
		"msg-text": message,
		"from-user": user_id
	} 
	await launchTwitchEvent("channel.chat.message", params)
}

async function twitchReconnect() {
	var cmd_array = ["event", "websocket", "reconnect"]
	var cmd = new Deno.Command("./twitch-cli", {args: cmd_array})
	await cmd.output()
}

async function launchTwitchEvent(event_type, params) {
	var cmd_array = ["event", "trigger", event_type, "--transport=websocket"]
	for (const [key, value] of Object.entries(params)) {
		cmd_array.push("--" + key + "=" + value)
	}
	console.log(cmd_array)
	var cmd = new Deno.Command("./twitch-cli", {args: cmd_array})
	await cmd.output()
}

async function getMockIdSecret() {
	return fetch('http://localhost:8080/units/clients')
	.then(response => {return response.json()})
	.then(function(data) {
		/*
		var data = data["data"]
		var client_id = data[0]["ID"]
		var client_secret = data[0]["Secret"]
		*/
		return data["data"][0]
	})
}

async function getBroadcasterId(client_id, client_secret) {
	var url = "http://localhost:8080/units/users"
	return fetch(url)
	.then(response => {return response.json()})
	.then(function(data) {
		var data = data["data"]
		var users_id = []
		broadcaster_id = data[0]["id"]
		for (var i = 1; i < data.length; i++) {
			users_id.push(data[i]["id"])
		}
		return {"broadcaster_id": broadcaster_id, "users_id": users_id}
	})
}

async function getMockToken(client_id, client_secret, broadcaster_id) {
	var params = new URLSearchParams();
	params.append("client_id", client_id)
	params.append("client_secret", client_secret)
	params.append("scope", scope_array.join(" ")) 
	params.append("grant_type", "user_token")
	params.append("user_id", broadcaster_id)
	var url = "http://localhost:8080/auth/authorize?" + params.toString()
	return fetch(url, {"method": "POST"})
	.then(response => {return response.json()})
	.then(function(data) {
		var token = data["access_token"]
		return token
		//location.href = "http://localhost:8000?" + params.toString()
	})
}

async function getModerators(broadcaster_id, client_id, users_id) {
	var endpoint = "moderation/moderators?broadcaster_id=" + broadcaster_id
	var headers = {
		"Authorization": "Bearer " + token,
		"Client-Id": client_id,
	}

	return fetch('http://localhost:8080/mock/' + endpoint, {"headers": headers})
	.then(response => {return response.json()})
	.then(function(data) {
		data = data["data"]
		var moderators_id = []
		for (var i = 0; i < data.length; i++) {
			var user_id = data[i]["user_id"]
			moderators_id.push(user_id)
			users_id.splice(users_id.indexOf(user_id), 1)
		}
		return {"users_id": users_id, "moderators_id": moderators_id}
	})
}

function makeUrl(client_id, token) {
	var params = new URLSearchParams();
	params.append("client_id", client_id)
	params.append("token", token)
	var url = "http://localhost:8000/browser_source.html?" + params.toString()
	return url
}

function emptyPostData() {
	 var postData = {
		"method": "POST",
		"body": "",
		"headers": {}
	}
	return postData
}