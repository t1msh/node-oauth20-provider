var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var notAuthorized = function (msg) {
    notAuthorized.super_.call(this, 'not_authorized', msg, 401, this.constructor);
};
util.inherits(notAuthorized, oauth2);
notAuthorized.prototype.name = 'OAuth2NotAuthorized';
notAuthorized.prototype.logLevel = 'warn';

module.exports = notAuthorized;
