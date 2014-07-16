var error = require('./../../error');

/**
 * Decision controller
 * Used for: "authorization_code"
 * Page is used to ask user whether user agree or not to allow client to access his information with current scope
 * It should return a POST form with "decision" parameter:
 * 0 - if user does not allow client to obtain access
 * 1 - if user allows
 * For basic example look into ./test/server/oauth20.js
 *
 * @param req Request object
 * @param res Response object
 * @param client Client object
 * @param scope Scope asked
 * @param user User object
 */
module.exports = function(req, res, client, scope, user) {
    throw new error.serverError('Decision page is not implemented');
};