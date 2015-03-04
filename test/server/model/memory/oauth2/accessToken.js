var crypto = require('crypto'),
    accessTokens = require('./../../data.js').accessTokens;

module.exports.getToken = function(accessToken) {
    return accessToken.token;
};

module.exports.create = function(userId, clientId, scope, ttl, cb) {
    var token = crypto.randomBytes(64).toString('hex');
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope, ttl: new Date().getTime() + ttl * 1000};
    accessTokens.push(obj);
    cb(null, token);
};

module.exports.fetchByToken = function(token, cb) {
    for (var i in accessTokens) {
        if (accessTokens[i].token == token) return cb(null, accessTokens[i]);
    }
    cb();
};

module.exports.checkTTL = function(accessToken) {
    return (accessToken.ttl > new Date().getTime());
};

module.exports.fetchByUserIdClientId = function(userId, clientId, cb) {
    for (var i in accessTokens) {
        if (accessTokens[i].userId == userId && accessTokens[i].clientId == clientId) return cb(null, accessTokens[i]);
    };
    cb();
};

