
//dependencies
var util      = require('util');
var ConnectionManager = require('../connectionManager.js');
var RethinkDb = require('rethinkdb');

function AccessTokenService(){}

var TABLE = "access_token";

AccessTokenService.getToken = function(accessToken) {
    return accessToken.token;
};

AccessTokenService.save = function(token, userId, clientId, scope, ttl, cb) {
    var obj = {
        
        token: token, 
        userId: userId, 
        clientId: clientId, 
        scope: scope, 
        ttl: new Date().getTime() + ttl * 1000,
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


AccessTokenService.fetchByToken = function(token, cb) {
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

AccessTokenService.checkTTL = function(accessToken) {
    return (accessToken.ttl > new Date().getTime());
};

AccessTokenService.fetchByUserIdClientId = function(userId, clientId, cb) {
    var where = {
        userId: userId,
        clientId: clientId
    };
    
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        
        var where = RethinkDb.and(
            RethinkDb.row('userId').eq(userId), 
            RethinkDb.row('clientId').eq(clientId),
            RethinkDb.row('ttl').gt(new Date().getTime())
        );
        RethinkDb.table(TABLE).filter(where).orderBy(RethinkDb.desc('ttl')).limit(1).run(conn, function(err, cursor) {
            if (util.isError(err)) {
                return cb(err);
            }
            cursor.next(ConnectionManager.done(conn, cb));
        });
    });
};

module.exports = AccessTokenService;
