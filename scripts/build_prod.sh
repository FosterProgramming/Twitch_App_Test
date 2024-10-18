export TWITCH_API_URL="https://api.twitch.tv/helix/"
export TWITCH_SUBSCRIPTION_URL="https://api.twitch.tv/helix/eventsub/subscriptions"
export TWITCH_SOCKET_URL="wss://eventsub.wss.twitch.tv/ws"
envsubst < "scripts/tmp_variables.js" > "variables.js"