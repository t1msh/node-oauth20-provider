var
    redis = require('redis');

module.exports = redis.createClient();

// No need to wait data load
require('./data.js').initialize();
