var
    async = require('async'),
    error = require('./../../error');

module.exports = function(oauth2, client, username, password, scope, pCb) {

    // Define variables
    var user,
        scope,
        refreshTokenValue,
        accessTokenValue;

    async.waterfall([
        // Check username and password parameters
        function(cb) {
            if (!username)
                return cb(new error.invalidRequest('Username is mandatory for password grant type'));
            oauth2.logger.debug('Username parameter check passed: ', username);

            if (!password)
                return cb(new error.invalidRequest('Password is mandatory for password grant type'));
            oauth2.logger.debug('Password parameter check passed: ', password);

            cb();
        },
        // Parse and check scope against supported and client available scopes
        function(cb) {
            scope = oauth2.model.client.transformScope(scope);
            scope = oauth2.model.client.checkScope(client, scope);
            if (!scope)
                cb(new error.invalidScope('Invalid scope for the client'));
            else {
                oauth2.logger.debug('Scope check passed: ', scope);
                cb();
            }
        },
        // Fetch user
        function(cb) {
            oauth2.model.user.fetchByUsername(username, function(err, obj) {
                if (err)
                    cb(new error.serverError('Failed to call user::fetchByUsername method'));
                else if (!obj)
                    cb(new error.invalidClient('User not found'));
                else {
                    oauth2.logger.debug('User fetched: ', obj);
                    user = obj;
                    cb();
                }
            });
        },
        // Check provided password
        function(cb) {
            oauth2.model.user.checkPassword(user, password, function(err, valid) {
                if (err)
                    cb(new error.serverError('Failed to call user:checkPassword method'));
                else if (!valid)
                    cb(new error.invalidClient('Wrong user password provided'));
                else
                    cb();
            });
        },
        // Remove old refreshToken (if exists) with userId-clientId pair
        function(cb) {
            oauth2.model.refreshToken.removeByUserIdClientId(oauth2.model.user.getId(user), oauth2.model.client.getId(client), function(err) {
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
            oauth2.model.refreshToken.create(oauth2.model.user.getId(user), oauth2.model.client.getId(client), scope, function(err, data) {
                if (err)
                    cb(new error.serverError('Failed to call refreshToken::save method'));
                else {
                    refreshTokenValue = data;
                    oauth2.logger.debug('Refresh token saved: ', refreshTokenValue);
                    cb();
                }
            });
        },
        // Generate new accessToken and save it
        function(cb) {
            oauth2.model.accessToken.create(oauth2.model.user.getId(user), oauth2.model.client.getId(client), scope, oauth2.model.accessToken.ttl, function(err, data) {
                if (err)
                    cb(new error.serverError('Failed to call accessToken::save method'));
                else {
                    accessTokenValue = data;
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