#!/bin/bash

clear

echo "Delete previous backend build/"
rm -Rf backend/build

cd frontend
echo "Build frontend assets..."
npm run build

echo "Move build folder to backend root"
mv build ../backend/

cd ../

echo "Adding to GIT repo"
git add -A
git commit -m "updated backend build assets"

