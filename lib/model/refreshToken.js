var
    error = require('./../error');

/**
 * Typical refreshToken schema:
 * userId:   { type: "object", required: true },
 * clientId: { type: "object", required: true },
 * token:    { type: "string", required: true, unique: true },
 * scope:  { type: "array", required: false,
 *     items: { type: "string", enum: ["possible", "scope", "values"] },
 * }
 *
 * Primary key: token
 * Unique key: userId + clientId pair should be unique
 */

/**
* Gets userId parameter of the refreshToken
*
* @param refreshToken {Object} RefreshToken object
*/
module.exports.getUserId = function(refreshToken) {
    throw new error.serverError('RefreshToken model method "getUserId" is not implemented');
};

/**
 * Gets clientId parameter of the refreshToken
 *
 * @param refreshToken {Object} RefreshToken object
 */
module.exports.getClientId = function(refreshToken) {
    throw new error.serverError('RefreshToken model method "getClientId" is not implemented');
};

/**
 * Gets scope parameter of the refreshToken
 *
 * @param refreshToken {Object} RefreshToken object
 */
module.exports.getScope = function(refreshToken) {
    throw new error.serverError('RefreshToken model method "getScope" is not implemented');
};

/**
 * Fetches refreshToken object by token
 * Should be implemented with server logic
 *
 * @param token {String} Unique identifier
 * @param cb {Function} Function callback ->(error, object)
 */
module.exports.fetchByToken = function(token, cb) {
    throw new error.serverError('RefreshToken model method "fetchByToken" is not implemented');
};

/**
 * Removes refreshToken (revokes) for the client-user pair
 * Should be implemented with server logic
 *
 * @param userId {String} Unique identifier
 * @param clientId {String} Unique identifier
 * @param cb {Function} Function callback ->(error)
 */
module.exports.removeByUserIdClientId = function(userId, clientId, cb) {
    throw new error.serverError('RefreshToken model method "removeByUserIdClientId" is not implemented');
};

/**
 * Create refreshToken object (generate + save)
 * Should be implemented with server logic
 *
 * @param userId {String} Unique identifier
 * @param clientId {String} Unique identifier
 * @param scope {Array|null} Scope values
 * @param cb {Function} Function callback ->(error, token{String})
 */
module.exports.create = function(userId, clientId, scope, cb) {
    throw new error.serverError('RefreshToken model method "create" is not implemented');
};