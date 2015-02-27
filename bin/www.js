#!/usr/bin/env node
/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('MoneyTracker:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = '3000';//normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */


// ============DATABASE STUFF==================
// make the MongoClient
var MongoClient = require('mongodb').MongoClient;
// specify where you can connect to the database
var url = 'mongodb://localhost:55555/gameDB';

// connect to the database in the main thread because
// I cant for the life of me figure out how to reliably get the database 
// into the main application without this. 
// This might even be better in the www file 
// Im not sure, it works lets use it.
MongoClient.connect(url, function(err, db) {
    if(err != null){
        // something went wrong abort abort!!!
        console.log('Error from DB: ' + err);
        console.log('Did not connect to database');
        return;
    }
    // if you get here you connected
    console.log( "Connected correctly to Database" );

    // all of the database stuff is in the bin folder
    // this makes it easier to know where everything is
    // all of the database function calls are here
    (require("./database.js"))(db);
    app.gameDB = db;
});

// cheap hack XXX
// wait a second, if the databse doesnt connect then setup the sockets anyways
setTimeout(function(){
    // setup the sockets
    var io = require("socket.io").listen(server);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    // all of the socket logic is in the socketsServ file
    (require("./socketsServ.js"))(io, app.gameDB);
}, 1000);

// from here down is express stuff

/**
 * Normalize a port into a number, string, or false.
 */

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

/**
 * Event listener for HTTP server "error" event.
 */

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

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}
