var
    util = require('util'),
    oauth2 = require('./oauth2.js');

// @todo: check standards (and other libraries) for error in case of wrong access_token
var forbidden = function (msg) {
    forbidden.super_.call(this, 'forbidden', msg, 403, this.constructor);
};
util.inherits(forbidden, oauth2);
forbidden.prototype.name = 'OAuth2Forbidden';
forbidden.prototype.logLevel = 'warn';

module.exports = forbidden;