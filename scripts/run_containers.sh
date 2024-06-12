#!/bin/bash
# run this script with bash to start containers that were already created with make_contaiers.sh
docker start mysql-server-final
docker start redis-server
sleep 8
docker start final-api