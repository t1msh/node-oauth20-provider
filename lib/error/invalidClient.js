var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var invalidClient = function (msg) {
    invalidClient.super_.call(this, 'invalid_client', msg, 401, this.constructor);
};
util.inherits(invalidClient, oauth2);
invalidClient.prototype.name = 'OAuth2InvalidClient';
invalidClient.prototype.logLevel = 'info';

module.exports = invalidClient;