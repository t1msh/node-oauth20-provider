var
    crypto = require('crypto'),
    util = require('util'),
    redis = require('./../redis.js');

var KEY = {
    CODE: 'code:%s'
};

module.exports.KEY = KEY;

module.exports.getUserId = function(code) {
    return code.userId;
};

module.exports.getClientId = function(code) {
    return code.clientId;
};

module.exports.getScope = function(code) {
    return code.scope;
};

module.exports.checkTtl = function(code) {
    // No need to check in redis storage because of key expiry mechanism
    return true;
};

module.exports.create = function(userId, clientId, scope, ttl, cb) {
    var code = crypto.randomBytes(32).toString('hex');
    var ttl = new Date().getTime() + ttl * 1000;
    var obj = {code: code, userId: userId, clientId: clientId, scope: scope};
    redis.setex(util.format(KEY.CODE, code), ttl, JSON.stringify(obj), function(err) {
        if (err) cb(err);
        else cb(null, code);
    });
};

module.exports.fetchByCode = function(code, cb) {
    redis.get(util.format(KEY.CODE, code), function(err, stringified) {
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

module.exports.removeByCode = function(code, cb) {
    redis.del(util.format(KEY.CODE, code), function(err) {
        cb(err);
    })
};