var
    oauth2lib = require('./../../lib/'),
    model = require('./model/');

oauth2 = new oauth2lib({log: {level: 2}});

// Set client methods
oauth2.model.client.getId = model.client.getId;
oauth2.model.client.getRedirectUri = model.client.getRedirectUri;
oauth2.model.client.fetchById = model.client.fetchById;
oauth2.model.client.checkSecret = model.client.checkSecret;

// User
oauth2.model.user.getId = model.user.getId;
oauth2.model.user.fetchById = model.user.fetchById;
oauth2.model.user.fetchByUsername = model.user.fetchByUsername;
oauth2.model.user.fetchFromRequest = model.user.fetchFromRequest;
oauth2.model.user.checkPassword = model.user.checkPassword;

// Refresh token
oauth2.model.refreshToken.getUserId = model.refreshToken.getUserId;
oauth2.model.refreshToken.getClientId = model.refreshToken.getUserId;
oauth2.model.refreshToken.fetchByToken = model.refreshToken.fetchByToken;
oauth2.model.refreshToken.removeByUserIdClientId = model.refreshToken.removeByUserIdClientId;
oauth2.model.refreshToken.save = model.refreshToken.save;

// Access token
oauth2.model.accessToken.getToken = model.accessToken.getToken;
oauth2.model.accessToken.fetchByToken = model.accessToken.fetchByToken;
oauth2.model.accessToken.checkTTL = model.accessToken.checkTTL;
oauth2.model.accessToken.fetchByUserIdClientId = model.accessToken.fetchByUserIdClientId;
oauth2.model.accessToken.save = model.accessToken.save;

// Code
oauth2.model.code.save = model.code.save;
oauth2.model.code.fetchByCode = model.code.fetchByCode;
oauth2.model.code.getUserId = model.code.getUserId;
oauth2.model.code.getClientId = model.code.getClientId;
oauth2.model.code.getScope = model.code.getScope;

// Expose oauth2 toolkit
module.exports = oauth2;