var
    util = require('util'),
    redis = require('./../redis.js');

// SOME KEY CONSTANTS
var KEY = {
    ACCESS_TOKEN:      'accessToken:%s',
    USER_CLIENT_TOKEN: 'userId:%s:clientId:%s'
};

module.exports.KEY = KEY;

module.exports.getToken = function(accessToken) {
    return accessToken.token;
};

module.exports.save = function(token, userId, clientId, scope, ttl, cb) {
    var ttl = new Date().getTime() + ttl * 1000;
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope};
    redis.setex(util.format(KEY.ACCESS_TOKEN, token), ttl, JSON.stringify(obj), cb);
    redis.setex(util.format(KEY.USER_CLIENT_TOKEN, userId, clientId), ttl, token, function() {});
};

var fetchByToken = function(token, cb) {
    redis.get(util.format(KEY.ACCESS_TOKEN, token), function(err, stringified) {
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

module.exports.fetchByToken = fetchByToken;

// No need to check expiry due to Redis TTL
module.exports.checkTTL = function(accessToken) {
    return true;
};

module.exports.fetchByUserIdClientId = function(userId, clientId, cb) {
    redis.get(util.format(KEY.USER_CLIENT_TOKEN, userId, clientId), function(err, token) {
        if (err) cb(err);
        else fetchByToken(token, cb);
    });
};

