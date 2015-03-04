var
    error = require('./../error');

/**
 * Typical code schema:
 * userId:   { type: "object", required: true },
 * clientId: { type: "object", required: true },
 * code:    { type: "string", required: true, unique: true },
 * scope:  { type: "array", required: false,
 *     items: { type: "string", enum: ["possible", "scope", "values"] },
 * }
 *
 * Primary key: code
 * Unique key: userId + clientId pair should be unique
 */

/**
 * Get userId parameter
 *
 * @param code {Object} Code object
 */
module.exports.getUserId = function(code) {
    throw new error.serverError('Code model method "getUserId" is not implemented');
};

/**
 * Get clientId parameter
 *
 * @param code {Object} Code object
 */
module.exports.getClientId = function(code) {
    throw new error.serverError('Code model method "getClientId" is not implemented');
};

/**
 * Get scope parameter
 *
 * @param code {Object} Code object
 */
module.exports.getScope = function(code) {
    throw new error.serverError('Code model method "getScope" is not implemented');
};

/**
 * Fetches accessToken object by token
 * Should be implemented with server logic
 *
 * Remember to check ttl if ttl is saved in object (if ttl is not valid return null)
 *
 * @param code {String} Unique identifier
 * @param cb {Function} Function callback ->(error, object)
 */
module.exports.fetchByCode = function(code, cb) {
    throw new error.serverError('Code model method "fetchByCode" is not implemented');
};

/**
 * Create code object (generate + save)
 * Should be implemented with server logic
 *
 * @param userId {String} Unique identifier
 * @param clientId {String} Unique identifier
 * @param scope {Array|null} Scope values
 * @param ttl {Number} Time to live in seconds
 * @param cb {Function} Function callback ->(error, code{String})
 */
module.exports.create = function(userId, clientId, scope, ttl, cb) {
    throw new error.serverError('Code model method "create" is not implemented');
};

/**
 * Remove code object (already used)
 * Should be implemented with server logic
 *
 * @param code {String} Generated code string
 * @param cb {Function} Function callback ->(error)
 */
module.exports.removeByCode = function(code, cb) {
    throw new error.serverError('Code model method "removeByCode" is not implemented');
};

/**
 * Access token time to live
 * @type {Number} Seconds
 */
module.exports.ttl = 300;