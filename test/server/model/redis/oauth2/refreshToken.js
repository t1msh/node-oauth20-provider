var
    crypto = require('crypto'),
    util = require('util'),
    redis = require('./../redis.js');

var KEY = {
    TOKEN: 'refreshToken:%s'
};

module.exports.KEY = KEY;

module.exports.getUserId = function(refreshToken) {
    return refreshToken.userId;
};

module.exports.getClientId = function(refreshToken) {
    return refreshToken.clientId;
};

module.exports.create = function(userId, clientId, scope, cb) {
    var token = crypto.randomBytes(64).toString('hex');
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope};
    redis.set(util.format(KEY.TOKEN, token), JSON.stringify(obj), function(err) {
        if (err) cb(err);
        else cb(null, token);
    });
};

module.exports.fetchByToken = function(token, cb) {
    redis.get(util.format(KEY.TOKEN, token), function(err, stringified) {
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

// @todo: remove old refreshTokens
module.exports.removeByUserIdClientId = function(userId, clientId, cb) {
    cb();
};

