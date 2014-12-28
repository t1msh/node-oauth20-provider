/**
 * Creates a wrapper around each service instance to name space it
 */
module.exports = {
    accessToken:    require('./accessToken.js'),
    client:         require('./client.js'),
    code:           require('./code.js'),
    refreshToken:   require('./refreshToken.js'),
    user:           require('./user.js')
};
