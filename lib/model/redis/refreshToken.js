var
    util = require('util'),
    redis = require('./connector.js');

var TOKEN = 'refreshToken:%s';

module.exports.getUserId = function(refreshToken) {
    return refreshToken.userId;
};

module.exports.save = function(token, userId, clientId, scope, cb) {
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope};
    redis.set(util.format(TOKEN, token), obj, cb);
};

module.exports.fetchByToken = function(token, cb) {
    redis.get(util.format(TOKEN, token), cb);
};

// @todo: remove old refreshTokens
module.exports.removeByUserIdClientId = function(userId, clientId, cb) {
    cb();
};

