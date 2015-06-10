var events = require('events'),
    util = require('util');

function _events(){

    events.call(this);

    this.log = function emit_log(level, message){
        this.emit('log',level, message);
    };

    this.uncaught_exception = function emit_uncaught_exception(req, err){
        this.emit('OAuth2UncaughtException', req, err);
    };

    this.caught_exception = function emit_caught_exception(req, err){
        this.emit(err.name, req, err);
    };

    this.authorization_code_granted = function emit_authorization_code_granted(req, code){
        this.emit('authorization_code_granted', req, code);
    };

    this.authorization_implicit_granted = function emit_authorization_implicit_granted(req, token){
        this.emit('authorization_implicit_granted', req, token);
    };

    this.token_granted = function emit_token_granted(event, req, token){
        this.emit(event, req, token);
    };

    this.access_token_fetched = function emit_access_token_fetched(req,token){
        this.emit('access_token_fetched', req, token);
    };
}

util.inherits(_events, events);

module.exports = new _events();