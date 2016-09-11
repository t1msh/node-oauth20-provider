var emitter = require('../events');

/**
 * Used log levels, from low priority to high
 */
var levels = [
    'debug',
    'info',
    'warn',
    'error'
];

/**
 * Colors for log levels.
 */
var colors = [
    90,
    36,
    33,
    31
];

/**
 * Pads the nice output to the longest log level.
 */
function pad (str) {
    var max = 0;

    for (var i = 0, l = levels.length; i < l; i++)
        max = Math.max(max, levels[i].length);

    if (str.length < max)
        return str + new Array(max - str.length + 1).join(' ');

    return str;
};

/**
 * Console logging class
 *
 * @param options
 * @constructor
 */
var Logger = function(options) {
    // Force options or die
    this.color = false !== options.color;
    this.level = options.level || 0;
    this.emit_event = options.emit_event || false;
};

/**
 * Log method
 *
 * @api public
 */
Logger.prototype.log = function (type) {
    var typeLevel = levels.indexOf(type);

    if (typeLevel < this.level) return;

    var args = [this.color ? '\033[' + colors[typeLevel] + 'm' + pad(type) + ':\033[39m' : type + ':']
        .concat(Array.prototype.slice.call(arguments, 1));

    if(this.emit_event){
        return emitter.log.apply(emitter, args);
    }

    console.log.apply(console,args);
};

/**
 * Generate methods for each level
 */
levels.forEach(function (name) {
    Logger.prototype[name] = function () {
        this.log.apply(this, [name].concat(Array.prototype.slice.call(arguments)));
    };
});


module.exports = Logger;