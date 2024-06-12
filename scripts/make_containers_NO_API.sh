#!/bin/bash
# if you don't want to use docker api, useful for testing
docker run -d --name mysql-server-final-no-api -p 3306:3306 \
	-e "MYSQL_RANDOM_ROOT_PASSWORD=yes" \
	-e "MYSQL_DATABASE=finalteam47" \
	-e "MYSQL_USER=finalteam47" \
	-e "MYSQL_PASSWORD=hunter2" \
	mysql
docker run -d --name redis-server \
	--network final-net \
	-p 6379:6379 \
	redis