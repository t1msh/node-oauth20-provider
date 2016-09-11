var
    model = require('./model/'),
    controller = require('./controller'),
    middleware = require('./middleware'),
    decision = require('./controller/authorization/decision'),
    logger = require('./util/logger.js'),
    emitter = require('./events');

var oauth2 = function(options) {
    var _self = this;

    options = options || {};

    options.log = options.log || {
        level: 0,
        color: true,
        emit_event: false
    };

//    options.flows = options.flows || [
//        'authorization_code',
//        'implicit',
//        'password',
//        'client_credentials'
//    ];

    this.options = options;

    // Initialize objects (available for redefinition)
    this.logger = new logger(this.options.log);
    this.model = model;
    this.decision = decision;

    this.logger.info('OAuth2 library initialized');

    // Injection method
    this.inject = function() {
        return function(req, res, next) {
            _self.logger.debug('Injecting oauth2 into request');

            // Commented out because reusing the oauth2 object means
            // the req.oauth2.accessToken which is set in bearer.js is
            // not safe to use between requests.
            //
            //req.oauth2 = _self;
            req.oauth2 = {
                options: _self.options,
                logger: _self.logger,
                model: _self.model,
                decision: _self.decision,
                controller: _self.controller,
                middleware: _self.middleware
            }

            next();
        }
    };
};

oauth2.prototype.controller = controller;
oauth2.prototype.middleware = middleware;
oauth2.prototype.events = emitter;

module.exports = oauth2;