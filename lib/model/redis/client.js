var
    util = require('util'),
    redis = require('./connector.js');

var CLIENT = 'client:%s';

module.exports.getId = function(client) {
    return client.id;
};

module.exports.getRedirectUri = function(client) {
    return client.redirectUri;
};

module.exports.fetchById = function(clientId, cb) {
    redis.get(util.format(CLIENT, clientId), cb);
};

// Add some hashing algorithm for security
module.exports.checkSecret = function(client, secret) {
    return (client.secret == secret);
};