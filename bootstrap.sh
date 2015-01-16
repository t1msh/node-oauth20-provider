#!/bin/sh

apt-get update
apt-get install -y nodejs npm redis-server

ln -s /usr/bin/nodejs /usr/bin/node

cd /vagrant
npm install