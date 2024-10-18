import {getUserId, getModerators} from './api.js'
import {startSocket} from './socket.js'
import {loadCatPicture} from './cat_picture.js'

window.message_callbacks = []
loadCatPicture()
window.moderators = []
window.subscription_ids = []
window.user_id = await getUserId()
window.moderators = await getModerators()
startSocket()


