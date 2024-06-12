#!/bin/bash
# run this script with bash to make, initialize, and start containers needed to run API
# if you want to reset containers, delete them then run this script again
# run this from the directory with the Dockerfile
docker build -t final-api .
docker network create --driver bridge final-net
docker run -d --name mysql-server-final \
	--network final-net \
	-e "MYSQL_RANDOM_ROOT_PASSWORD=yes" \
	-e "MYSQL_DATABASE=finalteam47" \
	-e "MYSQL_USER=finalteam47" \
	-e "MYSQL_PASSWORD=hunter2" \
	mysql
sleep 8
docker run -d --name final-api \
	--network final-net \
	-e "PORT=8000" \
	-e "MYSQL_HOST=mysql-server-final" \
	-p 8000:8000 \
	final-api
