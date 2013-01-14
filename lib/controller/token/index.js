// Auto-load all the files in the directory except current one
var modules = {};
require('fs').readdirSync(__dirname).forEach(function(file) {
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf('.'));
    modules[name] = require('./' + name);
});
module.exports = modules;
