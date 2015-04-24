var
    async = require('async'),
    error = require('./../../error');

module.exports = function(oauth2, client, sCode, redirectUri, pCb) {

    // Define variables
    var responseObj = {
        token_type:    "bearer"
    };
    var code,
        refreshTokenValue,
        accessTokenValue;

    async.waterfall([
        // Fetch code
        function(cb) {
            oauth2.model.code.fetchByCode(sCode, function(err, obj) {
                if (err)
                    cb(new error.serverError('Failed to call code::fetchByCode method'));
                else if (!obj)
                    cb(new error.invalidGrant('Code not found'))
                else if (oauth2.model.code.getClientId(obj) != oauth2.model.client.getId(client))
                    cb(new error.invalidGrant('Code is issued by another client'));
                else if (!oauth2.model.code.checkTTL(obj))
                    cb(new error.invalidGrant('Code is already expired'));
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
            //check if client has grant type refresh_token, if not, it will not be including in response (short time authorization)
            if(!oauth2.model.client.checkGrantType(client, 'refresh_token')){
                oauth2.logger.debug('Client has not the grant type refresh_token, skip creation');
                return cb();
            }

            oauth2.model.refreshToken.create(oauth2.model.code.getUserId(code), oauth2.model.code.getClientId(code), oauth2.model.code.getScope(code), function(err, data) {
                if (err)
                    cb(new error.serverError('Failed to call refreshToken::save method'));
                else {
                    responseObj.refresh_token = data;
                    oauth2.logger.debug('Refresh token saved: ', responseObj.refresh_token);
                    cb();
                }
            });
        },
        // Generate new accessToken and save it
        function(cb) {
            oauth2.model.accessToken.create(oauth2.model.code.getUserId(code), oauth2.model.code.getClientId(code), oauth2.model.code.getScope(code), oauth2.model.accessToken.ttl, function(err, data) {
                if (err)
                    cb(new error.serverError('Failed to call accessToken::save method'));
                else {
                    responseObj.access_token = data;
                    responseObj.expires_in = oauth2.model.accessToken.ttl;
                    oauth2.logger.debug('Access token saved: ', responseObj.access_token);
                    cb();
                }
            });
        },
        // Remove used code
        function(cb) {
            oauth2.model.code.removeByCode(sCode, function(err) {
                if (err)
                    cb(new error.serverError('Failed to call code::removeByCode method'));
                else {
                    oauth2.logger.debug('Code removed');
                    cb();
                }
            });
        }
    ], function(err) {
        if (err) pCb(err);
        else pCb(null, responseObj);
    });

};