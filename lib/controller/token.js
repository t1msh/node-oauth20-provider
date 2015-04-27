var
    async = require('async'),
    token = require('./token/'),
    response = require('./../util/response.js'),
    error = require('./../error');

/**
 * Token endpoint controller
 * Used for: "authorization_code", "password", "client_credentials", "refresh_token" flows
 *
 * @see http://tools.ietf.org/html/rfc6749#section-3.2
 * @param req Request object
 * @param res Response object
 */
module.exports = function(req, res) {
    req.oauth2.logger.debug('Invoking token endpoint');

    var clientId,
        clientSecret,
        grantType,
        client;

    async.waterfall([
        // Parse client credentials from BasicAuth header
        function(cb) {
            if (!req.headers || !req.headers.authorization)
                return cb(new error.invalidRequest('No authorization header passed'));

            var pieces = req.headers.authorization.split(' ', 2);
            if (!pieces || pieces.length !== 2)
                return cb(new error.invalidRequest('Authorization header is corrupted'));

            if (pieces[0] !== 'Basic')
                return cb(new error.invalidRequest('Unsupported authorization method: ', pieces[0]));

            pieces = new Buffer(pieces[1], 'base64').toString('ascii').split(':', 2);
            if (!pieces || pieces.length !== 2)
                return cb(new error.invalidRequest('Authorization header has corrupted data'));

            clientId = pieces[0];
            clientSecret = pieces[1];
            req.oauth2.logger.debug('Client credentials parsed from basic auth header: ', clientId, clientSecret);
            cb();
        },
        // Check grant type for server support
        function(cb) {
            if (!req.body.grant_type)
                cb(new error.invalidRequest('Body does not contain grant_type parameter'));

            grantType = req.body.grant_type;
            req.oauth2.logger.debug('Parameter grant_type passed: ', grantType);
            cb();
        },
        // Fetch client and check credentials
        function(cb) {
            req.oauth2.model.client.fetchById(clientId, function(err, obj) {
                if (err)
                    cb(new error.serverError('Failed to call client::fetchById method'));
                else if (!obj)
                    cb(new error.invalidClient('Client not found'));
                else {
                    req.oauth2.logger.debug('Client fetched: ', obj);
                    client = obj;
                    cb();
                }
            });
        },
        function(cb){
            req.oauth2.model.client.checkSecret(client, clientSecret, function(err, valid){
                if(err)
                    cb(new error.serverError('Failed to call client::checkSecret method'));
                else if (!valid)
                    cb(new error.invalidClient('Wrong client secret provided'));
                else
                    cb();
            });
        },
        // Check grant type against client available
        function(cb) {
            if (!req.oauth2.model.client.checkGrantType(client, grantType) && grantType !== 'refresh_token')
                cb(new error.unauthorizedClient('Grant type is not available for the client'));
            else {
                req.oauth2.logger.debug('Grant type check passed');
                cb();
            }
        },
        function(cb) {
            switch (grantType) {
                case 'authorization_code':
                    token.authorizationCode(req.oauth2, client, req.body.code, req.body.redirect_uri, cb);
                    break;
                case 'password':
                    token.password(req.oauth2, client, req.body.username, req.body.password, req.body.scope, cb);
                    break;
                case 'client_credentials':
                    token.clientCredentials(req.oauth2, client, req.body.scope, cb);
                    break;
                case 'refresh_token':
                    token.refreshToken(req.oauth2, client, req.body.refresh_token, req.body.scope, cb);
                    break;
                default:
                    cb(new error.unsupportedGrantType('Grant type does not match any supported type'));
                    break;
            }
        }
    ],
    function(err, data) {
        if (err) response.error(req, res, err);
        else response.data(req, res, data);
    });
};
