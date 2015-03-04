var
    error = require('./../error');

/**
* Typical accessToken schema:
* userId:   { type: "object", required: true },
* clientId: { type: "object", required: true },
* token:    { type: "string", required: true, unique: true },
* scope:  { type: "array", required: false,
*     items: { type: "string", enum: ["possible", "scope", "values"] },
* }
 *
 * Primary key: token
 * @todo: CHECK IT, seems no need to be unique
 * Unique key: userId + clientId pair should be unique
 */

/**
 * Gets token of the accessToken
 *
 * @param accessToken {Object} accessToken object
 */
module.exports.getToken = function(accessToken) {
    throw new error.serverError('accessToken model method "getToken" is not implemented');
};

/**
 * Fetches accessToken object by token
 * Should be implemented with server logic
 *
 * Remember to check ttl if ttl is saved in object (if ttl is not valid return null)
 *
 * @param token {String} Unique identifier
 * @param cb {Function} Function callback ->(error, object)
 */
module.exports.fetchByToken = function(token, cb) {
    throw new error.serverError('accessToken model method "fetchByToken" is not implemented');
};

/**
 * Fetches accessToken object by userId-clientId pair
 * Should be implemented with server logic
 *
 * @param userId {String} Unique identifier
 * @param clientId {String} Unique identifier
 * @param cb {Function} Function callback ->(error, object)
 */
module.exports.fetchByUserIdClientId = function(userId, clientId, cb) {
    throw new error.serverError('accessToken model method "fetchByUserIdClientId" is not implemented');
};

/**
 * Check if accessToken is valid and not expired
 *
 * @param accessToken
 */
module.exports.checkTTL = function(accessToken) {
    throw new error.serverError('accessToken model method "checkTTL" is not implemented');
};

/**
 * Create accessToken object (generate + save)
 * Should be implemented with server logic
 *
 * @param userId {String} Unique identifier
 * @param clientId {String} Unique identifier
 * @param scope {Array|null} Scope values
 * @param ttl {Number} Time to live in seconds
 * @param cb {Function} Function callback ->(error, token{String})
 */
module.exports.create = function(userId, clientId, scope, ttl, cb) {
    throw new error.serverError('accessToken model method "create" is not implemented');
};

/**
 * Access token time to live
 * @type {Number} Seconds
 */
module.exports.ttl = 3600;