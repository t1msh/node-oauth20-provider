var
    async = require('async'),
    error = require('./../../error');

module.exports = function(oauth2, client, refresh_token, scope, pCb) {
    // Define variables
    var user,
        refreshToken,
        accessToken,
        accessTokenValue;

    async.waterfall([
        // Check refresh_token parameter
        function(cb) {
            if (!refresh_token)
                return cb(new error.invalidRequest('RefreshToken is mandatory for refresh_token grant type'));
            oauth2.logger.debug('RefreshToken parameter check passed: ', refresh_token);

            cb();
        },
        // Standard is really weird here, do not check scope, just fill it from refreshToken
        // function(cb) {CHECK SCOPE PARAMETER FUNCTION OMITTED},
        // Fetch refreshToken
        function(cb) {
            oauth2.model.refreshToken.fetchByToken(refresh_token, function(err, obj) {
                if (err)
                    cb(new error.serverError('Failed to call refreshToken::fetchByToken method'));
                else if (!obj)
                    cb(new error.invalidGrant('Refresh token not found'));
                else if (oauth2.model.refreshToken.getClientId(obj) != oauth2.model.client.getId(client)) {
                    oauth2.logger.warn('Client id "' + oauth2.model.client.getId(client) + '" tried to fetch client id "' + obj.clientId + '" refresh token');
                    cb(new error.invalidGrant('Refresh token not found'));
                }
                else {
                    oauth2.logger.debug('RefreshToken fetched: ', obj);
                    refreshToken = obj;
                    cb();
                }
            });
        },
        // Fetch user
        function(cb) {
            oauth2.model.user.fetchById(oauth2.model.refreshToken.getUserId(refreshToken), function(err, obj) {
                if (err)
                    cb(new error.serverError('Failed to call user::fetchById method'));
                else if (!obj)
                    cb(new error.invalidClient('User not found'));
                else {
                    oauth2.logger.debug('User fetched: ', obj);
                    user = obj;
                    cb();
                }
            });
        },
        // Fetch issued access token (if it is already created and still active)
        function(cb) {
            oauth2.model.accessToken.fetchByUserIdClientId(oauth2.model.user.getId(user), oauth2.model.client.getId(client), function(err, obj) {
                if (err)
                    cb(new error.serverError('Failed to call accessToken::fetchByUserIdClientId'));
                else if (!obj) cb();
                else {
                    accessToken = obj;
                    oauth2.logger.debug('Fetched issued accessToken: ', obj);
                    cb();
                };
            });
        },
        // Issue new one (if needed)
        function(cb) {
            // No need if it already exists and valid
            if (accessToken) {
                accessTokenValue = oauth2.model.accessToken.getToken(accessToken);
                cb();
            }
            else {
                oauth2.model.accessToken.create(oauth2.model.user.getId(user), oauth2.model.client.getId(client), oauth2.model.refreshToken.getScope(refreshToken), oauth2.model.accessToken.ttl, function(err, data) {
                    if (err)
                        cb(new error.serverError('Failed to call accessToken::save method'));
                    else {
                        accessTokenValue = data;
                        oauth2.logger.debug('Access token saved: ', accessTokenValue);
                        cb();
                    }
                });
            }
        }
    ],
    function(err) {
        if (err) pCb(err);
        else pCb(null, {
            // @todo: add renew refresh token strategy
            token_type:    "bearer",
            access_token:  accessTokenValue,
            expires_in:    oauth2.model.accessToken.ttl
        });
    });
};