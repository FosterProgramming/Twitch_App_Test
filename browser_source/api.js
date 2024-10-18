import {TWITCH_API_URL} from "../variables.js"
import {startSocket} from "./socket.js"

export function makeEndpoint(endpoint) {
	return TWITCH_API_URL + endpoint
}

export async function getModerators(retry_time = 0) {
	var endpoint = "moderation/moderators?broadcaster_id=" + window.user_id
	return fetch(makeEndpoint(endpoint), {"headers": getHeaders()})
	.then(response => checkResponse(response))
	.then(function(data) {
		data = data["data"]
    	for (var i = 0; i < data.length; i++) {
    		moderators.push(data[i]["user_id"])
    	}
    	return moderators
  	})
  	.catch(error => {
		console.error('Error when getting moderators:', error);
		retry_time += 5000
		return new Promise((resolve) => {
    		setTimeout(() => resolve(
    			getModerators(retry_time)
    		), retry_time)
  		})
	});
}


export async function getUserId(retry_time = 0) {
	var endpoint = makeEndpoint("users")
	return fetch(endpoint, {"headers": getHeaders()})
	.then(response => checkResponse(response))
	.then(function(data) {
    	return data["data"][0]["id"]
  	})
  	.catch(error => {
		console.error('Error when getting user id:', error);
		retry_time += 5000
		return new Promise((resolve) => {
    		setTimeout(() => resolve(
    			getUserId(retry_time)
    		), retry_time)
  		})
	});
}

function getToken() {
	var params = new URLSearchParams(document.location.search);
	return params.get("token");
}

export function getHeaders() {
	var params = new URLSearchParams(document.location.search);
	var headers = {
		"Content-type": "application/json; charset=UTF-8",
		"Authorization": "Bearer " + params.get("token"),
		"Client-Id": params.get("client_id"),
	}
	return headers
}

export function checkResponse(response) {
	if (!response.ok) {
		console.error('Network response was not ok');
	}
	return response.json();
}