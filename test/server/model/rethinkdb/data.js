
//dependencies
var util = require('util');
var async = require('async');
var data = require('../data.js');
var config = require('./config.js');
var ConnectionManager = require('./connectionManager.js');
var RethinkDb = require('rethinkdb');

/**
 * Imports the sample data into RethinkDB
 */
function DataImport(){}

/**
 * Imports the data ensuring that the DB, tables, and data are all available
 */
DataImport.initialize = function() {
    
    var conn = null;
    var tableList = [];
    var tasks = [
        
        //get connection
        function(callback) {
            ConnectionManager.connect(function(err, connection) {
                conn = connection;
                callback(err);
            });
        },
        
        //ensure the DB exists
        function(callback) {
            RethinkDb.dbList().run(conn, function(err, dbList) {
                if (util.isError(err)) {
                    return callback(err);
                }
                else if (dbList.indexOf(config.db) >= 0) {
                    
                    //db already exists
                    return callback();
                }
                
                RethinkDb.dbCreate(config.db).run(conn, callback);
            });
        },
        
        //list tables
        function(callback) {
            RethinkDb.db(config.db).tableList().run(conn, function(err, tables) {
                tableList = tables;
                callback(err);
            });
        },
        
        //create tables
        function(callback) {
            var tasks = [
                DataImport.ensureTableTask(conn, 'access_token', tableList),
                DataImport.ensureTableTask(conn, 'refresh_token', tableList),
                DataImport.ensureTableTask(conn, 'authorization_code', tableList),
                DataImport.ensureTableTask(conn, 'client', tableList),
                DataImport.ensureTableTask(conn, 'user', tableList)
            ];
            async.series(tasks, callback);
        },
        
        //insert rows
        function(callback) {
            
            var tasks = [];
            data.clients.forEach(function(client) {
                tasks.push(DataImport.ensureRowTask(conn, 'client', client));
            });
            data.users.forEach(function(user) {
                tasks.push(DataImport.ensureRowTask(conn, 'user', user));
            });
            async.series(tasks, callback);
        }
    ];
    async.series(tasks, function(err, results) {
        if (conn) {
            conn.close();
        }
        
        if (err) {
            throw err;
        }
    });
};

/**
 * Ensures that a specific document is available in the specified table
 */
DataImport.ensureRowTask = function(conn, table, obj) {
    return function(callback) {
        RethinkDb.table(table).get(obj.id).replace(obj).run(conn, callback);
    };
};

/**
 * Ensures that the specified table exists
 */
DataImport.ensureTableTask = function(conn, table, tableList) {
    return function(callback) {
        if (tableList.indexOf(table) >= 0) {
            
            //table already exists
            return callback();
        }
        RethinkDb.db(config.db).tableCreate(table, {}).run(conn, callback);
    };
};

module.exports = DataImport;
