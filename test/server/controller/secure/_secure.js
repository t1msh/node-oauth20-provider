var middleware = require('./../../middleware')

module.exports = function(app) {
    app.all('secure/*', middleware.authorize);
};