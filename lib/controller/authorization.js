var
    async = require('async'),
    authorization = require('./authorization/'),
    response = require('./../util/response.js'),
    error = require('./../error');

/**
 * Authorization Endpoint controller
 * Used for: "authorization_code", "implicit" flows
 *
 * @see http://tools.ietf.org/html/rfc6749#section-3.1
 * @param req Request object
 * @param res Response object
 * @param next Optional parameter
 */
module.exports = function(req, res, next) {
    req.oauth2.logger.debug('Invoking authorization endpoint');

    var clientId,
        redirectUri,
        responseType,
        grantType,
        client,
        scope,
        user;

    async.waterfall([
        // Check redirect uri
        function(cb) {
            if (!req.query.redirect_uri)
                return cb(new error.invalidRequest('RedirectUri is mandatory for authorization endpoint'));

            redirectUri = req.query.redirect_uri;
            req.oauth2.logger.debug('RedirectUri parsed: ', redirectUri);
            cb();
        },
        // Check client credentials
        function(cb) {
            if (!req.query.client_id)
                return cb(new error.invalidRequest('ClientId is mandatory for authorization endpoint'));

            // Check for client_secret (prevent from passing it)
            if (req.query.client_secret)
                return cb(new error.invalidRequest('ClientSecret should not be passed by public clients'))

            clientId = req.query.client_id;
            req.oauth2.logger.debug('ClientId parsed: ', clientId);
            cb();
        },
        // Check response type parameter
        function(cb) {
            if (!req.query.response_type)
                return cb(new error.invalidRequest('ResponseType parameter is mandatory for authorization endpoint'));

            responseType = req.query.response_type;
            req.oauth2.logger.debug('Parameter response_type parsed: ', responseType);
            cb();
        },
        // Check grant type supported by server
        function(cb) {
            switch (responseType) {
                case 'code':
                    grantType = 'authorization_code';
                    break;
                case 'token':
                    grantType = 'implicit';
                    break;
                default:
                    return cb(new error.unsupportedResponseType('Unknown response_type parameter passed'))
                    break;
            }
            req.oauth2.logger.debug('Parameter response_type parsed: ', responseType);
            cb();
        },
        // Fetch client
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
        // Check redirect uri
        function(cb) {
            if (!req.oauth2.model.client.getRedirectUri(client))
                cb(new error.unsupportedResponseType('RedirectUri is not set for the client'));
            else if (req.oauth2.model.client.getRedirectUri(client) != redirectUri)
                cb(new error.invalidRequest('Wrong RedirectUri provided'));
            else {
                req.oauth2.logger.debug('RedirectUri check passed: ', redirectUri);
                cb();
            }
        },
        // Check grant type available for the client
        function(cb) {
            if (!req.oauth2.model.client.checkGrantType(client, grantType))
                cb(new error.unauthorizedClient('Grant type is not available for the client'));
            else {
                req.oauth2.logger.debug('Grant type check passed');
                cb();
            }
        },
        // Parse and check scope against supported and client available scopes
        function(cb) {
            scope = req.oauth2.model.client.transformScope(req.query.scope);
            scope = req.oauth2.model.client.checkScope(client, scope);
            if (!scope)
                cb(new error.invalidScope('Invalid scope for the client'));
            else {
                req.oauth2.logger.debug('Scope check passed: ', scope);
                cb();
            }
        },
        // Fetch user from request
        function(cb) {
            user = req.oauth2.model.user.fetchFromRequest(req);
            if (!user)
                cb(new error.invalidRequest('Failed to fetch logged user from request parameters'))
            else {
                req.oauth2.logger.debug('User fetched from request: ', user);
                cb();
            }
        }
    ],
    function(err) {
        if (err) response.error(req, res, err, redirectUri);
        else {
            if (req.method == 'GET')
                req.oauth2.decision(req, res, client, scope, user, redirectUri);
            else if (grantType == 'authorization_code')
                authorization.code(req, res, client, scope, user, redirectUri);
            else if (grantType == 'implicit')
                authorization.implicit(req, res, client, scope, user, redirectUri);
            else
                response.error(req, res, new error.invalidRequest('Wrong request method'), redirectUri);
        }
    });
};