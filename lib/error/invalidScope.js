var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var invalidScope = function (msg) {
    invalidScope.super_.call(this, 'invalid_scope', msg, 400, this.constructor);
};
util.inherits(invalidScope, oauth2);
invalidScope.prototype.name = 'OAuth2InvalidScope';
invalidScope.prototype.logLevel = 'info';

module.exports = invalidScope;