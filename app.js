// express dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//authentication dependencies
var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var userDB = "userInfo";

// logic to get the server working with sockets
var app = express();
var server = require('http').Server(app);
// make the server accessable
app.server = server;
var io = require('socket.io')(server);

// ============DATABASE==================
// make the MongoClient
var MongoClient = require('mongodb').MongoClient;
// specify where you can connect to the database
var url = process.env.DATABASE ? process.env.DATABASE : 'mongodb://localhost:55556/gameDB';
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
    // now that we are connected, connect the socket and the server
    // all of the socket logic is in the socketsServ file
    (require("./bin/socketsServ.js"))(io, db);
    app.db = db;
});

// route forwarding
var routes = require('./routes/index');
var login = require('./routes/login');
var registration = require('./routes/register');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// using sessions
var sess = {
    secret: 'Money Money',
    cookie: {},
    resave: false,
    saveUninitialized: false
}

// we have a favicon in the public folder but for now the file
// is static and included in layout.js we can change this easily
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(sess.secret));
app.use(express.static(path.join(__dirname, 'public')));




//===========authentication===========
var session = require('express-session');


// re enable this if we make this website secure
//if (app.get('env') === 'production') {
//  app.set('trust proxy', 1) // trust first proxy
//  sess.cookie.secure = true // serve secure cookies
//}

app.use(session(sess))
app.use(passport.initialize());
app.use(passport.session());

// http://en.wikipedia.org/wiki/Serialization
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  app.db.collection(userDB).find({ "_id":id }, function(err, user) {
    done(err, user);
  });
});
// this will only work after mongo has returned
// this might be a good thing to block during the
// connection to mongo
// Authenticator
passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {
        app.db.collection(userDB).findOne({
            'username': username,
        }, function(err, user) {
            if (err) {
            return done(err);
        }
        // if we dont return a user then the username is incorrect
        if (!user) {
            return done(null, false);
        }
        
        // https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm
        var hash = crypto.createHash('sha1');
        hash.update(password);
        var result = hash.digest('hex') ;
           
        if (result == user.hash){
            return done(null, user._id);
        }
        else
        {
            done(null, false);
        }  

        return done(null, user);
    });
  });
}));

// routing middleware
// Make our db accessible to our router
app.use(function(req,res,next){
    console.log(req.session) 
    req.db = app.db;
    next();
});

app.use('/', routes);
app.use('/login', login);
app.use('/register', registration);

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
