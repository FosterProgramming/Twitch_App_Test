import {makeEndpoint, getHeaders, checkResponse} from "./api.js"
import {TWITCH_SUBSCRIPTION_URL} from "../variables.js"

function makePostData() {
	var body = {	
		type: "channel.chat.message",
		condition: {
			broadcaster_user_id: window.user_id,
			user_id: window.user_id
		},
		transport: {
			method: "websocket",
			session_id: window.session_id
		},
		version: "1",
	}
	var postData = {
		"method": "POST",
		"body": JSON.stringify(body),
		"headers": getHeaders()
	}
	return postData
}

export function deleteOldSubscriptions() {
	console.log(window.subscription_ids)
	for (var i = 0; i < window.subscription_ids.length; i++) {
		deleteSubscription(window.subscription_ids[i])
	}
	window.subscription_ids = []
}

function deleteSubscription(id) {
	fetch(TWITCH_SUBSCRIPTION_URL + "?id=" + id, {
		"method": "DELETE",
		"headers": getHeaders()
	})
	.then(response => {
		//404 means the subscription has already been deleted
		if (!response.ok && response.status != 404) {
			console.error('Error when deleting subscriptions:', error);
		}
	})
}

export function makeSubscription() {
	deleteOldSubscriptions()
	fetch(TWITCH_SUBSCRIPTION_URL, makePostData())
	.then(response => checkResponse(response))
	.then(function(data) {
		window.subscription_ids.push(data["data"][0]["id"])
		console.log(window.subscription_ids)
	})
	.catch(error => {
		console.error('Error:', error);
	});
}