var
    request = require('supertest'),
    data = require('./server/model/data.js'),
    app = require('./server/app.js');

describe('Refresh Token Grant Type ',function() {

    this.timeout(3000);

    before(function() {
        app.get('oauth2').model.accessToken.ttl = 2;
    });

    after(function(){
        app.get('oauth2').model.accessToken.ttl = 3600;
    });

    var
        refreshToken,
        accessToken,
        newAccessToken;

    it('POST /token with grant_type="password" expect token', function(done) {
        request(app)
            .post('/token')
            .set('Authorization', 'Basic ' + new Buffer(data.clients[2].id + ':' + data.clients[2].secret, 'ascii').toString('base64'))
            .send({grant_type: 'password', username: data.users[0].username, password: data.users[0].password})
            .expect(200, /refresh_token/)
            .end(function(err, res) {
                if (err) return done(err);
                refreshToken = res.body.refresh_token;
                accessToken = res.body.access_token;
                done();
            });
    });

    it('POST /token with grant_type="refresh_token" expect same accessToken', function(done) {
        request(app)
            .post('/token')
            .set('Authorization', 'Basic ' + new Buffer(data.clients[2].id + ':' + data.clients[2].secret, 'ascii').toString('base64'))
            .send({grant_type: 'refresh_token', refresh_token: refreshToken})
            .expect(200, /access_token/)
            .end(function(err, res) {
                if (err)
                    done(err);
                else if (accessToken != res.body.access_token)
                    done(new Error('AccessToken strings do not match. Expected=['+accessToken+'] Result=['+res.body.access_token+']'));
                else
                    done();
            });
    });

    it('Wait and POST /token with grant_type="refresh_token" expect diferent [new]accessToken', function(done) {
        setTimeout(function() {
            request(app)
                .post('/token')
                .set('Authorization', 'Basic ' + new Buffer(data.clients[2].id + ':' + data.clients[2].secret, 'ascii').toString('base64'))
                .send({grant_type: 'refresh_token', refresh_token: refreshToken})
                .expect(200, /access_token/)
                .end(function (err, res) {
                    if (err)
                        done(err);
                    else if (accessToken == res.body.access_token)
                        done(new Error('AccessToken strings do match. Expected=[' + accessToken + '] Result=[' + res.body.access_token + ']'));
                    else{
                        newAccessToken = res.body.access_token;
                        done();
                    }
                });
        },2000);
    });

    it('POST /secure with old token expect forbidden', function(done) {
        request(app)
            .get('/secure')
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(403, /forbidden/, done);
    });

    it('POST /secure witj new token expect authorized', function(done) {
        request(app)
            .get('/secure')
            .set('Authorization', 'Bearer ' + newAccessToken)
            .expect(200, new RegExp(data.users[0].id, 'i'), done);
    });

});