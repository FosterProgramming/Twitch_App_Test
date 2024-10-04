import {getHeaders} from './subscriptions.js'
import {startSocket} from './socket.js'
import {loadCatPicture} from './commands.js'

loadCatPicture()
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
		console.log(data)
    	window.user_id = data["data"][0]["id"]
    	startSocket()
  	})
  	.catch(error => {
		console.error('Error when getting user id:', error);
	});
}