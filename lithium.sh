
source ~/.bashrc

cd ~/Projects/github/rewrite/
git pull origin master

rm -R dist
rm -R build

npm run build
