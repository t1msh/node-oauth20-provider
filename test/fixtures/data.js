module.exports = {
    users: [{
        id: 'user1.Id',
        username: 'user1.username',
        password: 'user1.password'
    }],
    clients: [{
        id: 'client1.Id',
        name: 'client1.password',
        secret: 'client1.Secret',
        redirectUri: 'http://example.org/oauth'
    }, {
        id: 'client2.Id',
        name: 'client2.authorizationCode',
        secret: 'client2.Secret',
        redirectUri: 'http://example.org/oauth'
    }],
    accessTokens: [],
    refreshTokens: [],
    codes: []
};