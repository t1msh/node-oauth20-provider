/**
 * Creates an overly simple configuration to connect to a RethinkDB cluster.  
 * The configuration assumes that the instance is on the local host and 
 * listening on the default port.  The DB name is arbitrary and can be changed 
 * to whatever you want.
 */
module.exports = {
    host: '127.0.0.1', 
    port: 28015, 
    db: 'oauth'
};