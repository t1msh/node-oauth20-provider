var
    util = require('util'),
    oauth2 = require('./oauth2.js');

var invalidRequest = function (msg) {
    invalidRequest.super_.call(this, 'invalid_request', msg, 400, this.constructor);
};
util.inherits(invalidRequest, oauth2);
invalidRequest.prototype.name = 'OAuth2InvalidRequest';
invalidRequest.prototype.logLevel = 'info';

module.exports = invalidRequest;