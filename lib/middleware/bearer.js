var
    response = require('./../util/response.js'),
    error = require('./../error/');

// @todo: add options for HMAC, force HEADER token, no errors parsing
module.exports = function (req, res, next) {

    req.oauth2.logger.debug('Invoking bearer token parser middleware');
    var token;

    // Look for token in header
    if (req.headers.authorization) {
        var pieces = req.headers.authorization.split(' ', 2);
        // Check auth header
        if (!pieces || pieces.length !== 2)
            return response.error(req, res, new error.accessDenied('Wrong authorization header'));
        // Only bearer auth is supported
        if (pieces[0].toLowerCase() != 'bearer')
            return response.error(req, res, new error.accessDenied('Unsupported authorization method header'));
        token = pieces[1];
        req.oauth2.logger.debug('Bearer token parsed from authorization header: ', token);
    }
    // Look for token in query string
    else if (req.query && req.query['access_token']) {
        token = req.query['access_token'];
        req.oauth2.logger.debug('Bearer token parsed from query params: ', token);
    }
    // Look for token in post body
    else if (req.body && req.body['access_token']) {
        token = req.body['access_token'];
        req.oauth2.logger.debug('Bearer token parsed from body params: ', token);
    }
    // Not found
    else
        return response.error(req, res, new error.accessDenied('Bearer token not found'));

    // Try to fetch access token
    req.oauth2.model.accessToken.fetchByToken(token, function(err, object) {
        if (err)
            response.error(req, res, err);
        else if (!object) {
            response.error(req, res, new error.forbidden('Token not found or expired'));
        }
        else if (!req.oauth2.model.accessToken.checkTTL(object)) {
            response.error(req, res, new error.forbidden('Token already expired'))
        }
        else {
            req.oauth2.accessToken = object;
            req.oauth2.logger.debug('AccessToken fetched: ', object);
            next();
        };
    });
};
