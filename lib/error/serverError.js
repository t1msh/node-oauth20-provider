var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var serverError = function (msg) {
    serverError.super_.call(this, 'server_error', msg, 500, this.constructor);
};
util.inherits(serverError, oauth2);
serverError.prototype.name = 'OAuth2ServerError';
serverError.prototype.logLevel = 'error';

module.exports = serverError;