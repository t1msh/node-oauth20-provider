module.exports = function(app) {
    app.get('secure/session', function (req, res) {
        res.send(req.user);
    });
};