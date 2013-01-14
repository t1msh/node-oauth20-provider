var
    query = require('querystring');

module.exports.checkAuthentication = function(url) {

    return function(req, res, next) {
        if (req.user) return next();

        url = url + '?' + query.stringify({backUrl: req.url});
        res.redirect(url);
    };
};
