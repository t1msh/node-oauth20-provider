// Run tests via "npm --type=TYPE test" (types available: memory (default), redis are available)
var TYPE = process.env['npm_config_type'] || 'memory';

var
    query           = require('querystring'),
    express         = require('express'),
    cookieParser    = require('cookie-parser'),
    session         = require('express-session'),
    bodyParser      = require('body-parser');

var
    config      = require('./config.js'),
    server      = express(),
    oauth20     = require('./oauth20.js')(TYPE),
    model       = require('./model/' + TYPE);

server.set('oauth2', oauth20);

// Middleware
server.use(cookieParser());
server.use(session({ secret: 'oauth20-provider-test-server', resave: false, saveUninitialized: false }));
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(oauth20.inject());

// View
server.set('views', './view');
server.set('view engine', 'jade');

// Middleware. User authorization
function isUserAuthorized(req, res, next) {
    if (req.session.authorized) next();
    else {
        var params = req.query;
        params.backUrl = req.path;
        res.redirect('/login?' + query.stringify(params));
    }
}

// Define OAuth2 Authorization Endpoint
server.get('/authorization', isUserAuthorized, oauth20.controller.authorization, function(req, res) {
    res.render('authorization', { layout: false });
});
server.post('/authorization', isUserAuthorized, oauth20.controller.authorization);

// Define OAuth2 Token Endpoint
server.post('/token', oauth20.controller.token);

// Define user login routes
server.get('/login', function(req, res) {
    res.render('login', {layout: false});
});

server.post('/login', function(req, res, next) {
    var backUrl = req.query.backUrl ? req.query.backUrl : '/';
    delete(req.query.backUrl);
    backUrl += backUrl.indexOf('?') > -1 ? '&' : '?';
    backUrl += query.stringify(req.query);

    // Already logged in
    if (req.session.authorized) res.redirect(backUrl);
    // Trying to log in
    else if (req.body.username && req.body.password) {
        model.oauth2.user.fetchByUsername(req.body.username, function(err, user) {
            if (err) next(err);
            else {
                model.oauth2.user.checkPassword(user, req.body.password, function(err, valid) {
                    if (err) next(err);
                    else if (!valid) res.redirect(req.url);
                    else {
                        req.session.user = user;
                        req.session.authorized = true;
                        res.redirect(backUrl);
                    }
                });
            }
        });
    }
    // Please login
    else res.redirect(req.url);
});

// Some secure method
server.get('/secure', oauth20.middleware.bearer, function(req, res) {
    if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
    if (!req.oauth2.accessToken.userId) return res.status(403).send('Forbidden');
    res.send('Hi! Dear user ' + req.oauth2.accessToken.userId + '!');
});

// Some secure client method
server.get('/client', oauth20.middleware.bearer, function(req, res) {
    if (!req.oauth2.accessToken) return res.status(403).send('Forbidden');
    res.send('Hi! Dear client ' + req.oauth2.accessToken.clientId + '!');
});

// Expose functions
var start = module.exports.start = function() {
    server.listen(config.server.port, config.server.host, function(err) {
        if (err) console.error(err);
        else console.log('Server started at ' + config.server.host + ':' + config.server.port);
    });
};

module.exports = server;

if (require.main == module) {
    start();
}