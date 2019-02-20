
source ~/.bashrc

cd ~/Projects/github/rewrite/
git pull origin master

rm dist/*
rm build/*

npm run build
