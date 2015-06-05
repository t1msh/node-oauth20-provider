var
    request = require('supertest'),
    data = require('./server/model/data.js'),
    app = require('./server/app.js');

describe('Password Grant Type without client\'s refresh token grant type',function() {

    before(function() {
        app.get('oauth2').model.client.checkGrantType = function(client, grant){
            return grant != 'refresh_token';
        };
    });

    after(function(){
        app.get('oauth2').model.client.checkGrantType = function(client, grant){
            return [];
        };
    });

    var
        accessToken;

    it('POST /token with grant_type="password" expect token', function(done) {
        request(app)
            .post('/token')
            .set('Authorization', 'Basic ' + new Buffer(data.clients[0].id + ':' + data.clients[0].secret, 'ascii').toString('base64'))
            .send({grant_type: 'password', username: data.users[0].username, password: data.users[0].password})
            .expect(200)
            .expect(function check_no_refresh_token(res){
                if(res.body.refresh_token){
                    throw new Error('refresh_token received')
                }
            })
            .end(function(err, res) {
                if (err) return done(err);
                accessToken = res.body.access_token;
                done();
            });
    });

    it('POST /secure expect authorized', function(done) {
        request(app)
            .get('/secure')
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(200, new RegExp(data.users[0].id, 'i'), done);
    });

});