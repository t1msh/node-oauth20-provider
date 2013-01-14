module.exports = function(req, res, client, scope, user) {

    var html = [
        'Currently your are logged with id = ' + req.oauth2.model.user.getId(user),
        'Client with id ' + req.oauth2.model.client.getId(client) + ' asks for access',
        'Scope asked ' + scope.join(),
        '<form method="POST">',
        '<input type="hidden" name="decision" value="1" />',
        '<input type="submit" value="Authorize" />',
        '</form>',
        '<form method="POST">',
        '<input type="hidden" name="decision" value="0" />',
        '<input type="submit" value="Cancel" />',
        '</form>'
    ];

    res.send(html.join('<br />'));
};