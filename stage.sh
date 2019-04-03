#!/bin/bash

# docker cheatsheet
# -------------------------------------
# docker container ls --all
# docker build -t <YOUR_USER_NAME>/myfirstapp .
# docker run --name=<IMAGE-NAME> -d -v <ABS-PATH>:<VIRTUAL-PATH> -p 5000:80 <IMAGE-NAME>
# docker restart <CONTAINER-NAME>
# docker stop <CONTAINER-NAME>

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
