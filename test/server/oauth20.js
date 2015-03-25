var oauth20 = require('./../../lib');

// Define methods
module.exports = function(type) {
    var obj = new oauth20({log: {level: 4}});

    var model = require('./model/' + type).oauth2;
    if (!model)
        throw new Error('Unknown model type: ' + type);

    // Redefine oauth20 abstract methods
    
    // Set client methods
    obj.model.client.getId = model.client.getId;
    obj.model.client.getRedirectUri = model.client.getRedirectUri;
    obj.model.client.fetchById = model.client.fetchById;
    obj.model.client.checkSecret = model.client.checkSecret;

    // User
    obj.model.user.getId = model.user.getId;
    obj.model.user.fetchById = model.user.fetchById;
    obj.model.user.fetchByUsername = model.user.fetchByUsername;
    obj.model.user.fetchFromRequest = model.user.fetchFromRequest;
    obj.model.user.checkPassword = model.user.checkPassword;

    // Refresh token
    obj.model.refreshToken.getUserId = model.refreshToken.getUserId;
    obj.model.refreshToken.getClientId = model.refreshToken.getClientId;
    obj.model.refreshToken.fetchByToken = model.refreshToken.fetchByToken;
    obj.model.refreshToken.removeByUserIdClientId = model.refreshToken.removeByUserIdClientId;
    obj.model.refreshToken.create = model.refreshToken.create;

    // Access token
    obj.model.accessToken.getToken = model.accessToken.getToken;
    obj.model.accessToken.fetchByToken = model.accessToken.fetchByToken;
    obj.model.accessToken.checkTTL = model.accessToken.checkTTL;
    obj.model.accessToken.fetchByUserIdClientId = model.accessToken.fetchByUserIdClientId;
    obj.model.accessToken.create = model.accessToken.create;

    // Code
    obj.model.code.create = model.code.create;
    obj.model.code.fetchByCode = model.code.fetchByCode;
    obj.model.code.removeByCode = model.code.removeByCode;
    obj.model.code.getUserId = model.code.getUserId;
    obj.model.code.getClientId = model.code.getClientId;
    obj.model.code.getScope = model.code.getScope;
    obj.model.code.checkTTL = model.code.getScope;

    // Decision controller
    obj.decision = function(req, res, client, scope, user) {
        var html = [
            'Currently your are logged with id = ' + req.oauth2.model.user.getId(user),
            'Client with id ' + req.oauth2.model.client.getId(client) + ' asks for access',
            'Scope asked ' + scope.join(),
            '<form method="POST">',
            '<input type="hidden" name="decision" value="1" />',
            '<input type="submit" value="Authorize" />',
            '</form>',
            '<form method="POST">',
            '<input type="hidden" name="decision" value="0" />',
            '<input type="submit" value="Cancel" />',
            '</form>'
        ];
        res.send(html.join('<br />'));
    };

    return obj;
};

