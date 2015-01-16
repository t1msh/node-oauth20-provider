
//dependencies
var util = require('util');
var ConnectionManager = require('../connectionManager.js');
var RethinkDb = require('rethinkdb');

function UserService(){}

var TABLE = "user";

UserService.getId = function(user) {
    return user.id;
};

UserService.fetchById = function(id, cb) {
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        RethinkDb.table(TABLE).get(id).run(conn, ConnectionManager.done(conn, cb));
    });
};

UserService.fetchByUsername = function(username, cb) {
    var where = {
        username: username
    };
    
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        RethinkDb.table(TABLE).filter(where).limit(1).run(conn,  function(err, cursor) {
            if (util.isError(err)) {
                return cb(err);
            }
            cursor.toArray(function(err, users) {
                if (util.isError(err)) {
                    return cb(err);
                }
                cb(err, users && users.length ? users[0] : null);
                conn.close();
            });
        });
    });
};

UserService.checkPassword = function(user, password) {
    
    //in production don't forget to encrypt your passwords!
    return (user.password == password);
};

UserService.fetchFromRequest = function(req) {
    return req.session.user;
};

module.exports = UserService;
