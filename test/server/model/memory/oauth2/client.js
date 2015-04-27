var clients = require('./../../data.js').clients;

module.exports.getId = function(client) {
    return client.id;
};

module.exports.getRedirectUri = function(client) {
    return client.redirectUri;
};

module.exports.fetchById = function(clientId, cb) {
    for (var i in clients) {
        if (clientId == clients[i].id) return cb(null, clients[i]);
    }
    cb();
};

module.exports.checkSecret = function(client, secret, cb) {
    return cb(null, client.secret == secret);
};