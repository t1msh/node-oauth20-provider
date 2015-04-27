var RethinkDb = require('rethinkdb'),
    connection = require('./../connection.js');

var TABLE = 'client';

module.exports.getId = function(client) {
    return client.id;
};

module.exports.getRedirectUri = function(client) {
    return client.redirectUri;
};

module.exports.fetchById = function(clientId, cb) {
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else RethinkDb.table(TABLE).get(clientId).run(conn, cb);
    });
};

module.exports.checkSecret = function(client, secret, cb) {
    return cb(null, client.secret == secret);
};