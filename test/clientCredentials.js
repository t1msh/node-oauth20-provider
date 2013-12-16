var
    request = require('supertest'),
    data = require('./server/model/data.js'),
    app = require('./server/app.js');

describe('Client Credentials Grant Type ',function() {

    var
        accessToken;

    it('POST /token with grant_type="client_credentials" expect token', function(done) {
        request(app)
            .post('/token')
            .set('Authorization', 'Basic ' + new Buffer(data.clients[0].id + ':' + data.clients[0].secret, 'ascii').toString('base64'))
            .send({grant_type: 'client_credentials'})
            .expect(200, /access_token/)
            .end(function(err, res) {
                if (err) return done(err);
                accessToken = res.body.access_token;
                done();
            });
    });

    it('POST /secure expect forbidden', function(done) {
        request(app)
            .get('/secure')
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(403, done);
    });

    it('POST /client expect authorized', function(done) {
        request(app)
            .get('/client')
            .set('Authorization', 'Bearer ' + accessToken)
            .expect(200, done);
    });

});