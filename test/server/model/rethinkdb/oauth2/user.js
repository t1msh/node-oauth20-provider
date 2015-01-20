var RethinkDb = require('rethinkdb'),
    connection = require('./../connection.js');

var TABLE = 'user';

module.exports.getId = function(user) {
    return user['id'];
};

module.exports.fetchById = function(id, cb) {
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else RethinkDb.table(TABLE).get(id).run(conn, cb);
    });
};

module.exports.fetchByUsername = function(username, cb) {
    connection.acquire(function(err, conn) {
        if (err) cb(err);
        else {
            RethinkDb.table(TABLE).filter({ username: username }).limit(1).run(conn, function(err, cursor) {
                if (err) cb(err);
                else {
                    cursor.toArray(function(err, users) {
                        if (err) cb(err);
                        else cb(err, users && users.length ? users[0] : null);
                    });
                }
            });
        }
    });
};

module.exports.checkPassword = function(user, password, cb) {
    (user.password == password) ? cb(null, true) : cb(null, false);
};

module.exports.fetchFromRequest = function(req) {
    return req.session.user;
};