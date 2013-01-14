var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var unsupportedGrantType = function (msg) {
    unsupportedGrantType.super_.call(this, 'unsupported_grant_type', msg, 400, this.constructor);
};
util.inherits(unsupportedGrantType, oauth2);
unsupportedGrantType.prototype.name = 'OAuth2UnsupportedGrantType';
unsupportedGrantType.prototype.logLevel = 'info';

module.exports = unsupportedGrantType;