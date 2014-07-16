var
    model = require('./model/'),
    controller = require('./controller'),
    middleware = require('./middleware'),
    decision = require('./controller/authorization/decision'),
    logger = require('./util/logger.js');

var oauth2 = function(options) {
    var _self = this;

    options = options || {};

    options.log = options.log || {
        level: 0,
        color: true
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
            req.oauth2 = _self;
            next();
        }
    };
};

oauth2.prototype.controller = controller;
oauth2.prototype.middleware = middleware;

module.exports = oauth2;