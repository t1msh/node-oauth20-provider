var
    query = require('querystring'),
    request = require('supertest'),
    data = require('./server/model/data.js'),
    app = require('./server/app.js');

describe('Implicit Grant Type ',function() {

    var
        loginUrl,
        authorizationUrl,
        cookie,
        accessToken;

    var cookiePattern = new RegExp('connect.sid=(.*?);');

    it('GET /authorization with response_type="token" expect login form redirect', function(done) {
        request(app)
            .get('/authorization?' + query.stringify({
            redirect_uri: data.clients[1].redirectUri,
            client_id: data.clients[1].id,
            response_type: 'token'
        }))
            .expect('Location', new RegExp('login'))
            .expect(302, function(err, res) {
                if (err) return done(err);
                loginUrl = res.headers.location;
                done();
            });
    });

    it('POST /login authorize', function(done) {
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

    it('GET /authorize with response_type="token" expect decision', function(done) {
        request(app)
            .get(authorizationUrl)
            .set('Cookie', cookie)
            .expect(200, function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    it('POST /authorize with response_type="token" and decision="1" expect code redirect', function(done) {
        request(app)
            .post(authorizationUrl)
            .send({ decision: 1 })
            .set('Cookie', cookie)
            .expect(302, function(err, res) {
                if (err) return done(err);

                var uri = res.headers.location;
                if (uri.indexOf('#') == -1) return done(new Error('Failed to parse redirect uri'));
                var q = query.parse(uri.substr(uri.indexOf('#') + 1));
                if (!q['access_token']) return done(new Error('No code value found in redirect uri'));

                accessToken = q['access_token'];
                done();
            })
    });

    it('POST /secure expect authorized', function(done) {
        request(app)
            .get('/secure')
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(200, new RegExp(data.users[0].id, 'i'), done);
    });


});