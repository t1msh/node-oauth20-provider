var
    async = require('async'),
    error = require('./../../error'),
    response = require('./../../util/response.js');

// @todo: move decision var to config
// @todo: add state

module.exports = function(req, res, client, scope, user, redirectUri) {

    var
        codeValue;

    async.waterfall([
        // Check user decision
        function(cb) {
            if (!req.body || typeof(req.body['decision']) == 'undefined')
                cb(new error.invalidRequest('No decision parameter passed'));
            else if (req.body['decision'] == 0)
                cb(new error.accessDenied('User denied the access to the resource'));
            else {
                req.oauth2.logger.debug('Decision check passed');
                cb();
            }
        },
        // Issue new code
        function(cb) {
            req.oauth2.model.code.create(req.oauth2.model.user.getId(user), req.oauth2.model.client.getId(client), scope, req.oauth2.model.code.ttl, function(err, data) {
                if (err)
                    cb(new error.serverError('Failed to call code::save method'));
                else {
                    codeValue = data;
                    req.oauth2.logger.debug('Access token saved: ', codeValue);
                    cb();
                }
            });
        }
    ],
    function(err) {
        if (err) response.error(req, res, err, redirectUri);
        else response.data(req, res, {code: codeValue}, redirectUri);
    });
};