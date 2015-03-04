var crypto = require('crypto'),
    RethinkDb = require('rethinkdb'),
    connection = require('./../connection.js');

var TABLE = 'access_token';

module.exports.getToken = function(accessToken) {
    return accessToken.token;
};

module.exports.create = function(userId, clientId, scope, ttl, cb) {
    var token = crypto.randomBytes(64).toString('hex');
    var obj = {token: token, userId: userId, clientId: clientId, scope: scope, ttl: new Date().getTime() + ttl * 1000};
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else RethinkDb.table(TABLE).insert(obj, {}).run(conn, function(err) {
            cb(err, token);
        });
    });
};

module.exports.fetchByToken = function(token, cb) {
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else {
            RethinkDb.table(TABLE).filter({ token: token }).run(conn, function(err, cursor) {
                if (err) cb(err);
                else cursor.next(cb);
            });
        }
    });
};

module.exports.checkTTL = function(accessToken) {
    return (accessToken.ttl > new Date().getTime());
};

module.exports.fetchByUserIdClientId = function(userId, clientId, cb) {
    var where = RethinkDb.and(
        RethinkDb.row('userId').eq(userId),
        RethinkDb.row('clientId').eq(clientId),
        RethinkDb.row('ttl').gt(new Date().getTime())
    );
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else {
            RethinkDb.table(TABLE).filter(where).orderBy(RethinkDb.desc('ttl')).limit(1).run(conn, function(err, cursor) {
                if (err) cb(err);
                else cursor.next(cb);
            });
        }
    });
};