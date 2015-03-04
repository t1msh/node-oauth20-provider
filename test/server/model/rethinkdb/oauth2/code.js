var crypto = require('crypto'),
    RethinkDb = require('rethinkdb'),
    connection = require('./../connection.js');

var TABLE = 'authorization_code';

module.exports.create = function(userId, clientId, scope, ttl, cb) {
    var code = crypto.randomBytes(32).toString('hex');
    var obj = {code: code, userId: userId, clientId: clientId, scope: scope, ttl: new Date().getTime() + ttl * 1000};

    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else RethinkDb.table(TABLE).insert(obj, {}).run(conn, function(err) {
            cb(err, code);
        });
    });
};

module.exports.fetchByCode = function(code, cb) {
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else {
            RethinkDb.table(TABLE).filter({ code: code }).limit(1).run(conn, function(err, cursor) {
                if (err) cb(err);
                else cursor.next(cb);
            });
        }
    });
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
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else RethinkDb.table(TABLE).filter({ code: code }).delete().run(conn, cb);
    });
};