
//dependencies
var util      = require('util');
var ConnectionManager = require('../connectionManager.js');
var RethinkDb = require('rethinkdb');

function ClientService(){}

var TABLE = "client";

ClientService.getId = function(client) {
    return client.id;
};

ClientService.getRedirectUri = function(client) {
    return client.redirectUri;
};

ClientService.fetchById = function(clientId, cb) {
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        RethinkDb.table(TABLE).get(clientId).run(conn, ConnectionManager.done(conn, cb));
    });
};

ClientService.checkSecret = function(client, secret) {
    return client.secret == secret;
};

module.exports = ClientService;
