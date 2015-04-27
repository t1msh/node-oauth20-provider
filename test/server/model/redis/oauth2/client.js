var
    util = require('util'),
    redis = require('./../redis.js');

var KEY = {
    CLIENT: 'client:%s'
};

module.exports.KEY = KEY;

module.exports.getId = function(client) {
    return client.id;
};

module.exports.getRedirectUri = function(client) {
    return client.redirectUri;
};

module.exports.fetchById = function(clientId, cb) {
    redis.get(util.format(KEY.CLIENT, clientId), function(err, stringified) {
        if (err) cb(err);
        else if (!stringified) cb();
        else {
            try {
                var obj = JSON.parse(stringified);
                cb(null, obj);
            } catch (e) {
                cb();
            }
        }
    });
};

// Add some hashing algorithm for security
module.exports.checkSecret = function(client, secret, cb) {
    return cb(null, client.secret == secret);
};