var SUBSCRIPTION_URL = "https://api.twitch.tv/helix/eventsub/subscriptions"

function getToken() {
	var params = new URLSearchParams(document.location.search);
	return params.getToken();
}

function getHeaders() {
	var headers = {
		"Content-type": "application/json; charset=UTF-8",
		"Authorization": "Bearer " + getToken(),
		"Client-Id": "wk9am7u7mkbdnuvzdlvmbfo2dfv7c3",
	}
	return headers
}

function makePostData() {
	var body = {
		type: "channel.chat.message",
		version: 1,
		condition: {
			broadcaster_user_id: window.user_id,
			user_id: window.user_id
		},
		transport: {
			method: "websocket",
			session_id: window.session_id
		}
	}
	var postData = {
		"method": "POST",
		"body": JSON.stringify(body),
		"headers": getHeaders()
	}
	return postData
}

function deleteOldSubscriptions() {
	fetch(SUBSCRIPTION_URL, {"headers": getHeaders()})
	.then(response => {
		if (!response.ok) {
			console.error('Network response was not ok');
		}
		return response.json();
	})
	.then(function(data) {
    	var data = data["data"]
    	for (var i = 0; i < data.length; i++) {
    		if (data[i]["type"] == "channel.chat.message") {
    			deleteSubscription(data[i]["id"])
    		}
    	}
  	})
}

function deleteSubscription(id) {
	fetch(SUBSCRIPTION_URL + "?id=" + id, {
		"method": "DELETE",
		"headers": getHeaders()
	})
	.catch(error => {
		console.error('Error when deleting subscriptions:', error);
	});
}

export function makeSubscription() {
	deleteOldSubscriptions()
	fetch(SUBSCRIPTION_URL, makePostData())
	.then(response => {
		if (!response.ok) {
			console.error('Network response was not ok');
		}
		return response.json();
	})
	.then(function(data) {
    	console.log(data);
  	})
	.catch(error => {
		console.error('Error:', error);
	});
}