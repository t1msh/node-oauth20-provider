
//dependencies
var util = require('util');
var ConnectionManager = require('../connectionManager.js');
var RethinkDb = require('rethinkdb');

function RefreshTokenService(){}

var TABLE = "refresh_token";

RefreshTokenService.getUserId = function(refreshToken) {
    return refreshToken.userId;
};

RefreshTokenService.fetchByToken = function(token, cb) {
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        RethinkDb.table(TABLE).filter({token: token}).run(conn, function(err, cursor) {
            if (util.isError(err)) {
                return cb(err);
            }
            cursor.next(ConnectionManager.done(conn, cb));
        });
    });
};

RefreshTokenService.removeByUserIdClientId = function(userId, clientId, cb) {
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        
        var where = {
            userId: userId,
            clientId: clientId
        };
        RethinkDb.table(TABLE).filter(where).delete().run(conn, ConnectionManager.done(conn, cb));
    });
};

RefreshTokenService.save = function(token, userId, clientId, scope, cb) {
    var obj = {
        token: token, 
        userId: userId, 
        clientId: clientId, 
        scope: scope,
        created: new Date(),
        type: TABLE
    };
    
    //persist the token
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        RethinkDb.table(TABLE).insert(obj, {returnChanges: true}).run(conn, ConnectionManager.done(conn, cb));
    });
};

module.exports = RefreshTokenService;
