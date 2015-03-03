// module dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// logic to get the server working with sockets
var app = require('express')();
var server = require('http').Server(app);
// make the server accessable
app.server = server;
var io = require('socket.io')(server);
// make sockets accessable
app.io = io;

// ============DATABASE STUFF==================
// make the MongoClient
var MongoClient = require('mongodb').MongoClient;
// specify where you can connect to the database
var url = 'mongodb://localhost:55555/gameDB';

// connect to the database
MongoClient.connect(url, function(err, db) {
    if(err != null){
        // something went wrong abort abort!!!
        console.log('Error from DB: ' + err);
        console.log('Did not connect to database');
        return;
    }
    // if you get here you connected
    console.log( "Connected correctly to Database" );
    console.log(url);

    // all of the database stuff is in the bin folder
    // this makes it easier to know where everything is
    // all of the database function calls are here
    (require("./bin/database.js"))(db);

    // now that we are connected, connect the socket and the server
    // all of the socket logic is in the socketsServ file
    (require("./bin/socketsServ.js"))(io, db);
    app.db = db;
});

// route forwarding
var routes = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// we have a favicon in the public folder but for now the file
// is static and included in layout.js we can change this easily
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    console.log("in development");
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
