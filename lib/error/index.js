module.exports = {
    accessDenied:               require('./accessDenied.js'),
    forbidden:                  require('./forbidden.js'),
    invalidClient:              require('./invalidClient.js'),
    invalidGrant:               require('./invalidGrant.js'),
    invalidRequest:             require('./invalidRequest.js'),
    invalidScope:               require('./invalidScope.js'),
    oauth2:                     require('./oauth2.js'),
    serverError:                require('./serverError.js'),
    unauthorizedClient:         require('./unauthorizedClient.js'),
    unsupportedGrantType:       require('./unsupportedGrantType.js'),
    unsupportedResponseType:    require('./unsupportedResponseType.js')
};