local_test: dev_variables open_daemons
	deno run --allow-net=localhost --allow-run="./twitch-cli,open,scripts/restart_socket_server" scripts/mock_login.js

prod_variables:
	sh scripts/build_prod.sh

dev_variables:
	sh scripts/build_dev.sh

open_daemons: screen_mock_server screen_mock_socket screen_http

screen_mock_server:
	screen -S mock_server -dm ./twitch-cli mock-api start
	touch screen_mock_server

screen_mock_socket:
	screen -S mock_socket -dm ./twitch-cli event websocket start-server -p 8081
	touch screen_mock_socket

screen_http:
	screen -S http -dm python3 ~/no_cors_server.py
	touch screen_http

close_daemons:
	pgrep SCREEN | xargs -n1 pgrep -P | xargs kill -9
	rm -f screen_*

clean: close_daemons
	rm twitch-cli

