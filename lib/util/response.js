var
    query = require('querystring'),
    error = require('../error/'),
    emitter = require('./../events');

function data(req, res, code, data) {
    res.statusCode = code;
    res.header('Cache-Control', 'no-store');
    res.header('Pragma','no-cache');
    res.send(data);
    req.oauth2.logger.debug('Response: ', data);
}

function redirect(req, res, redirectUri) {
    res.statusCode = 302;
    res.header('Location', redirectUri);
    res.end();
    req.oauth2.logger.debug('Redirect to: ', redirectUri);
}

module.exports.error = function(req, res, err, redirectUri) {
    // Transform unknown error
    if (!(err instanceof error.oauth2)) {
        req.oauth2.logger.error(err.stack);
        emitter.uncaught_exception(req, err);
        err = new error.serverError('Uncaught exception');
    }
    else {
        emitter.caught_exception(req, err);
        req.oauth2.logger[err.logLevel]('Exception caught', err.stack);
    }
        
    if (redirectUri) {
        var obj = {
            statuscode: err.status,
            message: err.message,
            name: err.name,
            error: err.code, // [deprecated] please use #code instead
            code: err.code,
            error_description: err.message // [deprecated] please use #message instead
        };
        if (req.query.state) obj.state = req.query.state;
        redirectUri += '?' + query.stringify(obj);
        redirect(req, res, redirectUri);
    }
    else
        var obj = {
            statusCode: err.status,
            message: err.message,
            name: err.name,
            error: err.code, // [deprecated] please use #code instead
            code: err.code,
            error_description: err.message // [deprecated] please use #message instead
        }
        data(req, res, err.status, obj);
};

module.exports.data = function(req, res, obj, redirectUri, anchor) {
    if (redirectUri) {
        if (anchor)
            redirectUri += '#';
        else
            redirectUri += (redirectUri.indexOf('?') == -1 ? '?' : '&');
        if (req.query.state) obj.state = req.query.state;
        redirectUri += query.stringify(obj);
        redirect(req, res, redirectUri);
    }
    else
        data(req, res, 200, obj);
};
