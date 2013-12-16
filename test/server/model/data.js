// In-memory storage
module.exports = {
    users: [
        {
            id:             'user1.id',
            username:       'user1.username',
            password:       'user1.password'
        }
    ],
    clients: [
        {
            id:             'client1.id',
            name:           'client1.name',
            secret:         'client1.secret',
            redirectUri:    'http://example.org/oauth2'
        },
        {
            id:             'client2.id',
            name:           'client2.name',
            secret:         'client2.Secret',
            redirectUri:    'http://example.org/oauth2'
        }
    ],
    codes: [],
    accessTokens: [],
    refreshTokens: []
};