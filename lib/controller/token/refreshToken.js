var
    async = require('async'),
    error = require('./../../error');

module.exports = function(oauth2, client, refresh_token, scope, pCb) {
    // Define variables
    var user,
        ttl,
        refreshToken,
        accessToken;

    var responseObj = {
        // @todo: add renew refresh token strategy
        token_type:    "bearer"
    };

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
                    oauth2.logger.warn('Client id "' + oauth2.model.client.getId(client) + '" tried to fetch client id "' + oauth2.model.refreshToken.getClientId(obj) + '" refresh token');
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
                }
            });
        },
        // Issue new one (if needed)
        function(cb) {
            // No need if it already exists and valid
            if (accessToken) {
                return oauth2.model.accessToken.getTTL(accessToken, function(err, ttl){
                    if(err){
                       return cb(new error.serverError('Failed to call accessToken::getTTL'));
                    }

                    if(!ttl) {
                        accessToken = null;
                    }
                    else {
                        responseObj.access_token = oauth2.model.accessToken.getToken(accessToken);
                        responseObj.expires_in = ttl;
                    }

                    cb();
                });
            }

            cb();
        },
        function(cb){
            if(!accessToken){
                return oauth2.model.accessToken.create(oauth2.model.user.getId(user), oauth2.model.client.getId(client), oauth2.model.refreshToken.getScope(refreshToken), oauth2.model.accessToken.ttl, function(err, data) {
                    if (err)
                        cb(new error.serverError('Failed to call accessToken::save method'));
                    else {
                        responseObj.access_token = data;
                        responseObj.expires_in = oauth2.model.accessToken.ttl;
                        oauth2.logger.debug('Access token saved: ', responseObj.access_token);

                        // Issue new refresh token when refreshing access token
                        if (oauth2.renewRefreshToken) {
                            oauth2.model.refreshToken.create(oauth2.model.user.getId(user), oauth2.model.client.getId(client), oauth2.model.refreshToken.getScope(refreshToken), function(err, data) {
                                if (err)
                                    cb(new error.serverError('Failed to call refreshToken::save method'));
                                else {
                                    oauth2.model.refreshToken.removeByRefreshToken(refresh_token, function(err) {
                                        if (err)
                                            cb(new error.serverError('Failed to call refreshToken::removeByRefreshToken method'));
                                        else {
                                            oauth2.logger.debug('Refresh token removed');
                                        }
                                    });
                                    responseObj.refresh_token = data;
                                    oauth2.logger.debug('Refresh token saved: ', responseObj.refresh_token);
                                    cb();
                                }
                            });                            
                        } else {
                            cb();
                        }
                    }
                });
            }

            cb();
        }
    ],
    function(err) {
        if (err) pCb(err);
        else {
            pCb(null, { event: 'token_granted_from_refresh_token', data:responseObj});
        }
    });
};