var
    util = require('util'),
    redis = require('./connector.js');

// SOME KEY CONSTANTS
var ACCESS_TOKEN = 'accessToken:%s';
var USER_CLIENT_TOKEN = 'userId:%s:clientId:%s';

module.exports.getToken = function(accessToken) {
    return accessToken.token;
};

module.exports.save = function(token, userId, clientId, scope, ttl, cb) {
    var ttl = new Date().getTime() + ttl * 1000;
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope};
    redis.setex(util.format(ACCESS_TOKEN, token), obj, ttl, cb);
    redis.setex(util.format(USER_CLIENT_TOKEN, userId, clientId), token, function() {});
};

module.exports.fetchByToken = function(token, cb) {
    redis.get(util.format(ACCESS_TOKEN, token), cb);
};

// No need to check expiry due to Redis TTL
module.exports.checkTTL = function(accessToken) {
    return true;
};

// @todo: fetch old access tokens somehow
module.exports.fetchByUserIdClientId = function(userId, clientId, cb) {
    redis.get(util.format(USER_CLIENT_TOKEN, userId, clientId), function(err, token) {
        if (err) return cb(err);
        else {
            redis.get(util.format(ACCESS_TOKEN, token), cb);
        }
    });
};

