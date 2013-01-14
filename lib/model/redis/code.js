var
    util = require('util'),
    redis = require('./connector.js');

var CODE = 'code:%s';

module.exports.getUserId = function(code) {
    return code.userId;
};

module.exports.getClientId = function(code) {
    return code.clientId;
};

module.exports.getScope = function(code) {
    return code.scope;
};

module.exports.save = function(code, userId, clientId, scope, ttl, cb) {
    var ttl = new Date().getTime() + ttl * 1000;
    var obj = {code: code, userId: userId, clientId: clientId, scope: scope};
    redis.setex(util.format(CODE, code), obj, ttl, cb);
};

module.exports.fetchByCode = function(code, cb) {
    redis.get(util.format(CODE, code), cb);
};