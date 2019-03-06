#!/bin/bash

# docker cheatsheet
# docker container ls --all
# docker build -t <YOUR_USE:RNAME>/myfirstapp .
# docker run --name=nginx -d -v ~/nginxlogs:/var/log/nginx -p 5000:80 nginx

cd frontend

# remove previous
rm -R build

npm run build

# delete existing stage assets
rm -Rf ../backend/templates
rm -Rf ../backend/build

# copy and overwrite existring files
yes | cp -rf build ../backend/


cd ../backend/

NAME=reflask
USER=fliptopbox
ABSPATH=`pwd`

# clean up docker, rebuild, run (in foreground)
yes | docker container prune

# docker build -t $USER/$NAME .
docker build -t $NAME .
docker run --name=$NAME -v $ABSPATH/db:/app/db -p 5000:80 $NAME
