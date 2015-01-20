var async = require('async'),
    RethinkDb = require('rethinkdb'),
    connection = require('./connection.js'),
    config = require('./config.js'),
    data = require('./../data.js');

module.exports.initialize = function(cb) {

    var conn,
        tables;

    async.series([
        // Connection
        function(cb) {
            connection.acquire(function(err, c) {
                if (err) cb(err);
                else {
                    conn = c;
                    cb();
                }
            });
        },
        // Create DB
        function(cb) {
            RethinkDb.dbList().run(conn, function(err, dbList) {
                if (err)
                    cb(err);
                else if (dbList.indexOf(config.db) != -1)
                    cb();
                else
                    RethinkDb.dbCreate(config.db).run(conn, cb);
            });
        },
        // Get tables
        function(cb) {
            RethinkDb.db(config.db).tableList().run(conn, function(err, data) {
                if (err) cb(err);
                else {
                    tables = data;
                    cb();
                }
            });
        },
        // Create missing tables
        function(cb) {
            async.eachSeries([ 'access_token', 'refresh_token', 'authorization_code', 'client', 'user' ], function(t, cb) {
                if (tables.indexOf(t) != -1) return cb();

                RethinkDb.db(config.db).tableCreate(t, {}).run(conn, cb);
            }, cb);
        },
        // Replace users data
        function(cb) {
            async.eachSeries(data.users, function(obj, cb) {
                RethinkDb.table('user').get(obj.id).replace(obj).run(conn, cb);
            }, cb);
        },
        // Replace clients data
        function(cb) {
            async.eachSeries(data.clients, function(obj, cb) {
                RethinkDb.table('client').get(obj.id).replace(obj).run(conn, cb);
            }, cb);
        }
    ], cb);

};

if (require.main == module) {
    module.exports.initialize(function(err) {
        if (err) console.error(err);
        else {
            console.log('Data initialized');
            console.log('Closing connection to RethinkDB');
            connection.close(function(err) {
                if (err) console.error(err);
                else console.log('Finished');
            });
        }
    });
}