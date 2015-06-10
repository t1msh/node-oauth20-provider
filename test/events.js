var
    query = require('querystring'),
    request = require('supertest'),
    data = require('./server/model/data.js'),
    app = require('./server/app.js');

describe('Emit log event',function() {

    before(function() {
        app.get('oauth2').logger.emit_event = true;
        app.get('oauth2').logger.level = 0;
    });

    after(function(){
        app.get('oauth2').logger.emit_event = false;
        app.get('oauth2').logger.level = 4;
    });

    it('Check log event on POST /token with grant_type="client_credentials" expect token', function(done) {
        var listener = function(){
            app.get('oauth2').events.removeListener('log', listener);
            done();
        };
        app.get('oauth2').events.on('log', listener);
        request(app)
            .post('/token')
            .set('Authorization', 'Basic ' + new Buffer(data.clients[0].id + ':' + data.clients[0].secret, 'ascii').toString('base64'))
            .send({grant_type: 'client_credentials'})
            .expect(200, /access_token/)
            .end(function(err, res) {
            });
    });

    it('Check a caught exception on POST /token with grant_type="client_credentials" expect token', function(done) {
        var listener = function(){
            app.get('oauth2').events.removeListener('OAuth2InvalidClient', listener);
            done();
        };
        app.get('oauth2').events.on('OAuth2InvalidClient', listener);
        request(app)
            .post('/token')
            .set('Authorization', 'Basic ' + new Buffer(data.clients[0].id + ':' + 'bad password', 'ascii').toString('base64'))
            .send({grant_type: 'client_credentials'})
            .expect(200, /access_token/)
            .end(function(err, res) {
            });
    });

});