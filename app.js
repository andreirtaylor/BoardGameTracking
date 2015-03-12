// ==============Express===============
// express dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// route forwarding
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var Chance = require('chance');
var chance = new Chance();
app.chance = chance;

//============Authentication==============
//authentication dependencies
var passport = require('passport');
var crypto = require('crypto');
app.crypto = crypto;
var LocalStrategy = require('passport-local').Strategy;

// variables for authentication
// using sessions
var sess = {
    secret: 'Money Money',
    cookie: {},
    resave: false,
    saveUninitialized: false
}

// this should definitely be moved out and made into a new algorithm
function passwordHash(password){
    // https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm
    var hash = crypto.createHash('sha1');
    hash.update(password);
    return hash.digest('hex') ;
}
app.passwordHash = passwordHash;

// ============DATABASE==================
// mongo dependencies
var MongoClient = require('mongodb').MongoClient;
app.MongoClient = MongoClient;
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.io = io;
// because ObjectID is a constructor you have to 
var ObjectId = function(){
    return require('mongodb').ObjectID;
};
app.ObjectId = ObjectId;

// variables for database
var userDB = "userInfo";
app.server = server;
// specify where you can connect to the database
var dbUrl = process.env.DATABASE ? process.env.DATABASE : 'mongodb://localhost:55556/gameDB';
app.dbUrl = dbUrl;




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// we have a favicon in the public folder but for now the file
// is static and included in layout.js we can change this easily
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(sess.secret));
app.use(express.static(path.join(__dirname, 'public')));

// uncomment this if we make this website secure
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
        app.db.collection(userDB).findOne({'username': username },
            function(err, user) {
                if (err) {
                return done(err);
            }
            // if we dont return a user then the username is incorrect
            if (!user) {
                return done(null, false);
            }
            
            result = passwordHash(password)
               
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

// Make our db accessible to our router
// on every request!!!
app.use(function(req,res,next){
    req.passwordHash = app.passwordHash;
    req.userDB = userDB;
    req.db = app.db;
    next();
});

// routing middleware
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
