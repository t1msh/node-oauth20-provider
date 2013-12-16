var async = require('async'),
    util = require('util'),
    redis = require('./redis.js'),
    data = require('./../data.js');

module.exports.initialize = function() {
    async.parallel([
        // Insert user
        function(cb) {
            var model = require('./oauth2/user.js');
            async.eachSeries(data.users, function(user, cb) {
                redis.set(util.format(model.KEY.USER, user.id), JSON.stringify(user), function(err) {
                    if (err) return cb(err);
                    redis.set(util.format(model.KEY.USER_USERNAME, user.username), user.id, cb)
                })
            }, cb);
        },
        // Insert client
        function(cb) {
            var model = require('./oauth2/client.js');
            async.eachSeries(data.clients, function(client, cb) {
                redis.set(util.format(model.KEY.CLIENT, client.id), JSON.stringify(client), cb);
            }, cb)
        }
    ], function(err) {
        if (err) throw new Error('Unable to fill redis with test data');
    });
};
