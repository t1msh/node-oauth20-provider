var
    error = require('./../error');

/**
 * Typical client schema:
 * _id:    { type: "object", required: true, unique: true },
 * name:   { type: "string", required: true },
 * secret: { type: "string", required: true },
 * uri:    { type: "string", required: false },
 * scope:  { type: "array", required: false,
 *     items: { type: "string", enum: ["possible", "scope", "values"] },
  * },
 * grants: { type: "array", required: false,
 *     items: { type: "string", enum: ["authorization_code", "implicit", "password", "client_credentials"] }
 * }
 */

/**
 * Gets clients primary key
 *
 * @param client {Object} Client object
 */
module.exports.getId = function(client) {
    throw new error.serverError('Client model method "getId" is not implemented');
};

/**
 * Gets clients secret
 *
 * @param client {Object} Client object
 */
module.exports.getSecret = function(client) {
    throw new error.serverError('Client model method "getSecret" is not implemented');
};

/**
 * Gets clients redirect uri
 *
 * @param client {Object} Client object
 */
module.exports.getRedirectUri = function(client) {
    throw new error.serverError('Client model method "getRedirectUri" is not implemented');
};

/**
 * Fetches client object by primary key
 * Should be implemented with server logic
 *
 * @param clientId {String} Unique identifier
 * @param cb {Function} Function callback ->(error, object)
 */
module.exports.fetchById = function(clientId, cb) {
    /**
     * For example:
     *
     */
    throw new error.serverError('Client model method "fetchById" is not implemented');
};

/**
 * Checks secret for the client
 * Function arguments MAY be different
 *
 * @param client {Object} Client object
 * @param secret {String} Password to be checked
 */
module.exports.checkSecret = function(client, secret, cb) {
    /**
     * For example:
     * superHashFunction(secret, function(err, hash){
     *  if(err){
     *      return cb(err);
     *  }
     *
     *  cb(null,client.secret === hash)
     * });
     *
     * OR for sync hash function
     *
     * cb(null, client.secret != superHashFunction(secret));
     *
     */
    throw new error.serverError('Client model method "checkSecret" is not implemented');
};

/**
 * Checks grant type permission for the client
 * Default: do not check it
 * Function arguments MAY be different
 *
 * @param client {Object} Client object
 * @param grant {String} Grant type to be checked for
 */
module.exports.checkGrantType = function(client, grant) {
    /**
     * For example:
     * if (client.grants.indexOf(grant) !== -1) return true;
     * else false;
     */
    return true;
};

/**
 * Checks scope permission for the client
 * Default: do not check it, return empty array
 * Function arguments MAY be different
 *
 * @param client {Object} Client object
 * @param scope {String} Scope string (space delimited) passed via parameters
 * @return {Array|boolean} Return checked scope array or false
 */
module.exports.checkScope = function(client, scope) {
    /**
     * For example:
     * scope.forEach(function(item) {
     *   if (scope.indexOf(item) == -1) return false;
     * });
     * return scope;
     */
    return [];
};

/**
 * Transforms scope body parameter to scope array
 *
 * @param scope
 */
module.exports.transformScope = function(scope) {
    if (!scope) return [];
    return scope.split(' ');
};