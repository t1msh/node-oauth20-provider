var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var unsupportedResponseType = function (msg) {
    unsupportedResponseType.super_.call(this, 'unsupported_response_type', msg, 400, this.constructor);
};
util.inherits(unsupportedResponseType, oauth2);
unsupportedResponseType.prototype.name = 'OAuth2UnsupportedResponseType';
unsupportedResponseType.prototype.logLevel = 'info';

module.exports = unsupportedResponseType;