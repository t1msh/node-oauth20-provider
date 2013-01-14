var
    async = require('async'),
    response = require('./../../util/response.js'),
    error = require('./../../error');

module.exports = function(oauth2, client, code, redirectUri, pCb) {

    // Define variables
    var code,
        refreshTokenValue,
        accessTokenValue;

    async.waterfall([
        // Fetch code
        function(cb) {
            oauth2.model.code.fetchByCode(code, function(err, obj) {
                if (err)
                    cb(new error.serverError('Failed to call code::fetchByCode method'));
                else if (!obj)
                    cb(new error.invalidGrant('Code not found'))
                else {
                    oauth2.logger.debug('Code fetched: ', obj);
                    code = obj;
                    cb();
                }
            });
        },
        // @todo: clarify. Check redirectUri? Weird standard, why should we?
        // Remove old refreshToken (if exists) with userId-clientId pair
        function(cb) {
            oauth2.model.refreshToken.removeByUserIdClientId(oauth2.model.code.getUserId(code), oauth2.model.code.getClientId(code), function(err) {
                if (err)
                    cb(new error.serverError('Failed to call refreshToken::removeByUserIdClientId method'));
                else {
                    oauth2.logger.debug('Refresh token removed');
                    cb();
                }
            });
        },
        // Generate new refreshToken and save it
        function(cb) {
            refreshTokenValue = oauth2.model.refreshToken.generateToken();
            oauth2.model.refreshToken.save(refreshTokenValue, oauth2.model.code.getUserId(code), oauth2.model.code.getClientId(code), oauth2.model.code.getScope(code), function(err) {
                if (err)
                    cb(new error.serverError('Failed to call refreshToken::save method'));
                else {
                    oauth2.logger.debug('Refresh token saved: ', refreshTokenValue);
                    cb();
                }
            });
        },
        // Generate new accessToken and save it
        function(cb) {
            accessTokenValue = oauth2.model.accessToken.generateToken();
            oauth2.model.accessToken.save(accessTokenValue, oauth2.model.code.getUserId(code), oauth2.model.code.getClientId(code), oauth2.model.code.getScope(code), oauth2.model.accessToken.ttl, function(err) {
                if (err)
                    cb(new error.serverError('Failed to call accessToken::save method'));
                else {
                    oauth2.logger.debug('Access token saved: ', accessTokenValue);
                    cb();
                }
            });
        }
    ],
        function(err) {
            if (err) pCb(err);
            else pCb(null, {
                refresh_token: refreshTokenValue,
                token_type:    "bearer",
                access_token:  accessTokenValue,
                expires_in:    oauth2.model.accessToken.ttl
            });
        });

};