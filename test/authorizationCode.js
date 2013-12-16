var
    query = require('querystring'),
    request = require('supertest'),
    data = require('./server/model/data.js'),
    app = require('./server/app.js');

describe('Authorization Code Grant Type ',function() {

    var
        loginUrl,
        authorizationUrl,
        cookie,
        code,
        accessToken;

    var cookiePattern = new RegExp('connect.sid=(.*?);');

    it('GET /authorization with response_type="code" expect login form redirect', function(done) {
        request(app)
            .get('/authorization?' + query.stringify({
                redirect_uri: data.clients[1].redirectUri,
                client_id: data.clients[1].id,
                response_type: 'code'
            }))
            .expect('Location', new RegExp('login'))
            .expect(302, function(err, res) {
                if (err) return done(err);
                loginUrl = res.headers.location;
                done();
            });
    });

    it('POST /login expect authorized', function(done) {
        request(app)
            .post(loginUrl)
            .send({ username: data.users[0].username, password: data.users[0].password })
            .expect('Location', new RegExp('authorization'))
            .expect(302, function(err, res) {
                if (err) return done(err);
                authorizationUrl = res.headers.location;
                cookie = cookiePattern.exec(res.headers['set-cookie'][0])[0];
                done();
            });
    });

    it('GET /authorize with response_type="code" expect decision', function(done) {
        request(app)
            .get(authorizationUrl)
            .set('Cookie', cookie)
            .expect(200, function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('POST /authorize with response_type="code" and decision="1" expect code redirect', function(done) {
        request(app)
            .post(authorizationUrl)
            .send({ decision: 1 })
            .set('Cookie', cookie)
            .expect(302, function(err, res) {
                if (err) return done(err);

                var uri = res.headers.location;
                if (uri.indexOf('?') == -1) return done(new Error('Failed to parse redirect uri'));
                var q = query.parse(uri.substr(uri.indexOf('?') + 1));
                if (!q['code']) return done(new Error('No code value found in redirect uri'));

                code = q['code'];
                done();
            })
    });

    it('POST /token with grant_type="authorization_code" expect token', function(done) {
        request(app)
            .post('/token')
            .set('Authorization', 'Basic ' + new Buffer(data.clients[1].id + ':' + data.clients[1].secret, 'ascii').toString('base64'))
            .send({grant_type: 'authorization_code', code: code, redirectUri: data.clients[1].redirectUri})
            .expect(200, /refresh_token/)
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