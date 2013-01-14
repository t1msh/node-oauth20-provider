var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var invalidGrant = function (msg) {
    invalidGrant.super_.call(this, 'invalid_grant', msg, 400, this.constructor);
};
util.inherits(invalidGrant, oauth2);
invalidGrant.prototype.name = 'OAuth2InvalidGrant';
invalidGrant.prototype.logLevel = 'info';

module.exports = invalidGrant;