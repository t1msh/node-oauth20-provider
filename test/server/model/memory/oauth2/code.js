var crypto = require('crypto'),
    codes = require('./../../data.js').codes;

module.exports.create = function(userId, clientId, scope, ttl, cb) {
    var code = crypto.randomBytes(32).toString('hex');
    var obj = {code: code, userId: userId, clientId: clientId, scope: scope, ttl: new Date().getTime() + ttl * 1000};
    codes.push(obj);
    cb(null, code);
};

module.exports.fetchByCode = function(code, cb) {
    for (var i in codes) {
        if (codes[i].code == code) return cb(null, codes[i]);
    }
    cb();
};

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
    return (code.ttl > new Date().getTime());
};

module.exports.removeByCode = function(code, cb) {
    for (var i in codes) {
        if (codes[i].code == code) {
            codes.splice(i, 1);
            break;
        }
    }
    cb();
};