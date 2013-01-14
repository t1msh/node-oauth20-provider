var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var accessDenied = function (msg) {
    accessDenied.super_.call(this, 'access_denied', msg, 403, this.constructor);
};
util.inherits(accessDenied, oauth2);
accessDenied.prototype.name = 'OAuth2AccessDenied';
accessDenied.prototype.logLevel = 'info';

module.exports = accessDenied;