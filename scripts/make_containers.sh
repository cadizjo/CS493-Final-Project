#!/bin/bash
# run this script with bash to make, initialize, and start containers needed to run API
docker run -d --name mysql-server-final -p 3306:3306 \
	-e "MYSQL_RANDOM_ROOT_PASSWORD=yes" \
	-e "MYSQL_DATABASE=finalteam47" \
	-e "MYSQL_USER=finalteam47" \
	-e "MYSQL_PASSWORD=hunter2" \
	mysql
