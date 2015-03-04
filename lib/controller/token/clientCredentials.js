var
    async = require('async'),
    response = require('./../../util/response.js'),
    error = require('./../../error');

module.exports = function(oauth2, client, scope, pCb) {

    // Define variables
    var scope,
        accessTokenValue;

    async.waterfall([
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
        // Generate new accessToken and save it
        function(cb) {
            oauth2.model.accessToken.create(null, oauth2.model.client.getId(client), scope, oauth2.model.accessToken.ttl, function(err, data) {
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
            token_type:    "bearer",
            access_token:  accessTokenValue,
            expires_in:    oauth2.model.accessToken.ttl
        });
    });
};