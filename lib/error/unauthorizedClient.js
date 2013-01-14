var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var unauthorizedClient = function (msg) {
    unauthorizedClient.super_.call(this, 'unauthorized_client', msg, 400, this.constructor);
};
util.inherits(unauthorizedClient, oauth2);
unauthorizedClient.prototype.name = 'OAuth2UnauthorizedClient';
unauthorizedClient.prototype.logLevel = 'info';

module.exports = unauthorizedClient;