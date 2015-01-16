
//dependencies
var util = require('util');
var ConnectionManager = require('../connectionManager.js');
var RethinkDb = require('rethinkdb');

function AuthorizationCodeService(){}

var TABLE = "authorization_code";

AuthorizationCodeService.save = function(code, userId, clientId, scope, ttl, cb) {
    
    //ID is the same as code so we don't have to create a manual index.  We 
    //can get a quick lookup for free
    var obj = {
        code: code, 
        userId: userId, 
        clientId: clientId, 
        scope: scope, 
        ttl: new Date().getTime() + ttl * 1000,
        created: new Date(),
        type: TABLE
    };
    
    //persist the authorization code 
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        RethinkDb.table(TABLE).insert(obj, {returnChanges: true}).run(conn, ConnectionManager.done(conn, cb));
    });
};

AuthorizationCodeService.fetchByCode = function(code, cb) {
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        RethinkDb.table(TABLE).filter({code: code}).limit(1).run(conn, function(err, cursor) {
            if (util.isError(err)) {
                return cb(err);
            }
            cursor.next(ConnectionManager.done(conn, cb));
        });
    });
};

AuthorizationCodeService.getUserId = function(code) {
    return code.userId;
};

AuthorizationCodeService.getClientId = function(code) {
    return code.clientId;
};

AuthorizationCodeService.getScope = function(code) {
    return code.scope;
};

AuthorizationCodeService.checkTtl = function(code) {
    return (code.ttl > new Date().getTime());
};

AuthorizationCodeService.removeByCode = function(code, cb) {
    ConnectionManager.connect(function(err, conn) {
        if (util.isError(err)) {
            return cb(err);
        }
        RethinkDb.table(TABLE).filter({code: code}).delete().run(conn, ConnectionManager.done(conn, cb));
    });
};

module.exports = AuthorizationCodeService;
