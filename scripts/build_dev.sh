export TWITCH_API_URL="http://localhost:8080/mock/"
export TWITCH_SUBSCRIPTION_URL="http://localhost:8081/eventsub/subscriptions"
export TWITCH_SOCKET_URL="ws://localhost:8081/ws"
envsubst < "scripts/tmp_variables.js" > "variables.js"
