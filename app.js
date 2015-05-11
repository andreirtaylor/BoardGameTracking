    // ==============Express===============
    // express dependencies
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    // ============ROUTES=============
    routes = require('./routes/index.js'),
    app = express(),
    compression = require('compression'),

    // ============DATABASE==================
    // mongo dependencies
    MongoClient = require('mongodb').MongoClient,
    server = require('http').Server(app),
    io = require('socket.io')(server),
    // this is a litte confusing it is used to parse mogo id's
    ObjectId = require('mongodb').ObjectID,
    Chance = require('chance'),
    chance = new Chance(),
    userDB = "userInfo",
    templateDB = "gameTemplates",
    // variables for database
    // specify where you can connect to the database
    dbUrl = process.env.DATABASE && process.env.DATABASE.trim()

    //============Authentication==============
    //authentication dependencies
    passport = require('passport'),
    crypto = require('crypto'),
    LocalStrategy = require('passport-local').Strategy,
    MongoStore = require('connect-mongo')(session),
    passwordHash = function(password) {
        // https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm
        var hash = crypto.createHash('sha1');
        hash.update(password);
        return hash.digest('hex') ;
    },
    // session settings
    sess = {
        secret: process.env.COOKIE ? process.env.COOKIE.trim() : 'Money Money',
        cookie: {
            maxAge: 24 * 3600000 // 24 hours
        },
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            url: dbUrl,
            touchAfter: 0, // time period in seconds
        })
    },
    sessionMiddleware = session(sess);

//===============Globals for other files=============
app.dbUrl = dbUrl;
app.chance = chance;
app.passwordHash = passwordHash;
app.MongoClient = MongoClient;
app.crypto = crypto;
app.io = io;
app.ObjectId = ObjectId;
app.server = server;
app.templateDB = templateDB;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// we have a favicon in the public folder but for now the file
// is static and included in layout.js we can change this easily
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compression());
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

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// remove attributes from the user
function unpackUser(user){
    return {
        username:user.username,
        _id:user._id + ''
    };
}

// when we find users with passport dont return the
// games list
var findUsers = { inProgress: 0 };

// http://en.wikipedia.org/wiki/Serialization
passport.serializeUser(function(user, done) {
    done(null, unpackUser(user) );
});

passport.deserializeUser(function(user, done) {
    app.db.collection(userDB).findOne(
        { "_id": new ObjectId(user._id) },
        findUsers,
        function(err) {
            done(err, unpackUser(user));
        }
        );
});

// Authenticator
passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {
        app.db.collection(userDB).findOne(
            {'search': username.toUpperCase() },
            findUsers,
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
                return done(null, unpackUser(user));
            }
            else
        {
            done(null, false);
        }
            }
        );
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
