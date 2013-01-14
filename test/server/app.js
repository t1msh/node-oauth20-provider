var
    query = require('querystring'),
    fixtures = require('./../fixtures/data.js'),
    express = require('express'),
    config = require('./config.js'),
    oauth2 = require('./oauth2.js');

var server = express();
server.use(express.cookieParser());
server.use(express.session({secret: 'oauth2-test-server'}));
server.use(express.bodyParser({mapParams: false}));
server.use(oauth2.inject());
server.set('views', './views');
server.set('view engine', 'jade');

function isAuthorized(req, res, next) {
    if (req.session.authorized) return next();
    res.redirect('/login?' + query.stringify({backUrl: req.url}));
}

server.get('/login', function(req, res, next) {
    res.render('login', {layout: false});
});

server.post('/login', function(req, res, next) {
    var backUrl = req.query.backUrl ? req.query.backUrl : '/';
    if (req.session.authorized ||
        (req.body.username == fixtures.users[0].username && req.body.password == fixtures.users[0].password)) {
        req.session.authorized = true;
        req.session.user = fixtures.users[0];
        res.redirect(backUrl);
    }
    else {
        res.redirect('/login?' + query.stringify({backUrl: backUrl}));
    }
});

// Define Authorization Endpoint
server.get('/authorization', isAuthorized, oauth2.controller.authorization, function(req, res) {
    res.render('authorization', {layout: false});
});
server.post('/authorization', isAuthorized, oauth2.controller.authorization);

// Define Token Endpoint
server.post('/token', oauth2.controller.token);

// Some secure api method
server.get('/secure', oauth2.middleware.bearer, function(req, res) {
    if (!req.oauth2.accessToken) return res.send(403, 'Forbidden');
    if (!req.oauth2.accessToken.userId) return res.send(403, 'Forbidden');
    res.send('Hi! Dear user ' + req.oauth2.accessToken.userId + '!');
});
// Some secure client api method
server.get('/public', oauth2.middleware.bearer, function(req, res) {
    if (!req.oauth2.accessToken) return res.send(403, 'Forbidden');
    res.send('Hi! Dear client ' + req.oauth2.accessToken.clientId + '!');
});








// Expose functions
var start = module.exports.start = function(cb) {
    server.listen(config.port, config.host, cb);
};

module.exports = server;

if (require.main == module) {
    start(function() {});
};
