#!/bin/sh

apt-get update
apt-get install -y nodejs npm
ln -s /usr/bin/nodejs /usr/bin/node

apt-get install -y redis-server

echo "deb http://download.rethinkdb.com/apt trusty main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- http://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y rethinkdb
sudo cp /etc/rethinkdb/default.conf.sample /etc/rethinkdb/instances.d/instance1.conf
sudo /etc/init.d/rethinkdb restart

cd /vagrant
npm install