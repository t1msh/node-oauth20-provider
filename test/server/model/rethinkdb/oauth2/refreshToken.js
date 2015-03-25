var crypto = require('crypto'),
    RethinkDb = require('rethinkdb'),
    connection = require('./../connection.js');

var TABLE = 'refresh_token';

module.exports.getUserId = function(refreshToken) {
    return refreshToken.userId;
};

module.exports.getClientId = function(refreshToken) {
    return refreshToken.clientId;
};

module.exports.fetchByToken = function(token, cb) {
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else {
            RethinkDb.table(TABLE).filter({token: token}).run(conn, function(err, cursor) {
                if (err) cb(err);
                else cursor.next(cb);
            });
        }
    });
};

module.exports.removeByUserIdClientId = function(userId, clientId, cb) {
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else {
            RethinkDb.table(TABLE).filter({
                userId: userId,
                clientId: clientId
            }).delete().run(conn, cb);
        }
    });
};

module.exports.create = function(userId, clientId, scope, cb) {
    var token = crypto.randomBytes(64).toString('hex');
    var obj = { token: token, userId: userId, clientId: clientId, scope: scope };

    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else RethinkDb.table(TABLE).insert(obj, {}).run(conn, function(err) {
            cb(err, token);
        });
    });
};