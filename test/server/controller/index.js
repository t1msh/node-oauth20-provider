var fs = require('fs');

var recursiveExports = function(dir, app) {
    fs.readdirSync(dir).forEach(function(file) {
        var path = dir + '/' + file;

        if (file == "index.js") return;

        var stat = fs.statSync(path);
        if (stat.isDirectory())
            recursiveExports(path, app);
        else
            require(path)(app);
    });
};

module.exports = function(app) {
    recursiveExports(__dirname, app);
};