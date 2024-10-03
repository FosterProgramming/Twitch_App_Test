import {getHeaders} from './.js'
import {startSocket} from './socket.js'

getUserId()

function getUserId() {
	fetch("https://api.twitch.tv/helix/users", {"headers": getHeaders()})
	.then(response => {
		if (!response.ok) {
			console.error('Network response was not ok');
		}
		return response.json();
	})
	.then(function(data) {
    	window.user_id = data["data"]["id"]
    	startSocket()
  	})
  	.catch(error => {
		console.error('Error when getting user id:', error);
	});
}