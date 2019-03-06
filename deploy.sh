#!/bin/bash

clear

key="$1"
svr="$2"

if [ -z $1 ]
    then
        echo "Enter server's deploy key:"
        read key
fi

if [ -z $2 ]
    then
        echo "Enter server's domain name:"
        read svr
fi

dest="${key}@${key}${svr}.com:/home1/${key}/repos/rewriting/"
echo "\n\nDeploy build folder to ...\n$dest"

npm run build

scp -r build $dest

echo "\n\nRemoving build folder"
rm -Rf build

