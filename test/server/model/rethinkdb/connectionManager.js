
//dependencies
var config = require('./config.js');
var RethinkDb = require('rethinkdb');

/**
 * Creates and closes connections.
 */
function ConnectionManager(){}

/**
 * Convenience callback function to ensure that the connection is closed before 
 * calling back with the result
 */
ConnectionManager.done = function(conn, cb) {
    return function(err, result) {
        cb(err, result);
        conn.close();
    };
};

/**
 * Creates a connection to RethinkDB.  Current nodejs driver does not support 
 * connection pooling so connecitons are on demand.
 */
ConnectionManager.connect = function(cb) {
    RethinkDb.connect(config, cb);
};

//export everything
module.exports = ConnectionManager;

//ensure DB, tables, and test data are available
var data = require('./data.js');
data.initialize();
