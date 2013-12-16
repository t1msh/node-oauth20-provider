var
    util = require('util'),
    redis = require('./../redis.js');

var KEY = {
    TOKEN: 'refreshToken:%s'
};

module.exports.KEY = KEY;

module.exports.getUserId = function(refreshToken) {
    return refreshToken.userId;
};

module.exports.save = function(token, userId, clientId, scope, cb) {
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope};
    redis.set(util.format(KEY.TOKEN, token), JSON.stringify(obj), function(err) {
        if (err) cb(err);
        else cb(null, obj);
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

