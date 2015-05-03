#!/usr/bin/env node

// Module dependencies.

var app = require('../app'),
    server = app.server,
    debug = require('debug')('MoneyTracker:server'),
    http = require('http'),
    keepAlive = require('./keepAlive'),
    // Get port from environment and store in Express.
    port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

// make the MongoClient
// connect to the database
app.MongoClient.connect(app.dbUrl, function(err, db) {
    if(err != null){
        // something went wrong abort abort!!!
        console.log('Error from DB: ' + err);
        console.log('Did not connect to database');
        return;
    }
    // if you get here you connected
    console.log( "Connected correctly to Database" );
    // hide the username an password
    console.log(app.dbUrl.replace(/^.*@/,''));

    // now that we are connected, connect sockets and the server
    app.db = db;
    (require("./socketLogic.js"))(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    keepAlive();
});

// Normalize a port into a number, string, or false.

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "error" event.

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}
