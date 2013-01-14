var
    util = require('util');

var oauth2 = function (code, msg, status, constructor) {
    Error.call(this);
    Error.captureStackTrace(this, constructor || this.constructor);

    this.code = code;
    this.message = msg;
    this.status = status;
};
util.inherits(oauth2, Error);
oauth2.prototype.name = 'OAuth2AbstractError';
oauth2.prototype.logLevel = 'error';

module.exports = oauth2;