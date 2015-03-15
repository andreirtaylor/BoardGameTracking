var router = require('express').Router();
//authentication dependencies
var passport = require('passport');

// generate the jade parameters
function parameterGen(req, message){
    if(req.isAuthenticated()){
        var user = req.user;
        return {
            loggedIn: true,
            username: user.username,
            message: message
        }
    }
}

// render pages with the correct dropdown menu if the
// user is logged in
router.get('/', function(req, res, next) {
	res.render('index', parameterGen(req));
});

router.get('/newgame', function(req, res, next){
    res.render('newgame', parameterGen(req));
});

router.get('/samplegame', function(req, res, next){
    res.render('samplegame', parameterGen(req));
});

router.get('/gamescreen', function(req, res, next){
	res.render('gamescreen', parameterGen(req));
});

// redirect the user if they are logged in
function testAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        res.redirect('/profile'); 
    }else{
        next();
    }
}

router.get(
    '/login', 
    testAuthenticated,
    function(req, res, next) {
	    res.render('login');
});

router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {    
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.render('login', {
                message: "Authentication Failed",
                type: "danger"
            }); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            return res.redirect('/profile');
        });
    })(req, res, next)
});

router.get(
    '/register', 
    testAuthenticated,
    function(req, res, next) {
	    res.render('register');
});

// new registration
router.post('/register', function(req, res, next) {
    //make a new user
    // defined in the main app
    var userDB = req.userDB;
    var db = req.db;
    var passwordHash = req.passwordHash;
    // get the username, password, password confirm, and email
    var username = req.body.username;
    var password = req.body.password;
    var passConf = req.body.passwordConf;
    var email = req.body.email;
    // make sure that all fields are filled
    if(!req.body.username || !req.body.password || !req.body.passwordConf || !req.body.email){
        res.send("All boxes must contain something");
        return;
    }
    //make sure the passwords match
    if(!(password === passConf)){
        res.send("Passwords do not match");
        return;
    }
    //check for duplicates in the database
    db.collection(userDB).findOne({ 'username': username }, function (err, user){
        if(err){
            res.send('Error processing request');
        }
        else if(user){
            return res.render('register', {
                message:"Username is taken",
                type: "danger"
            }); 
        }
        else{
            password = passwordHash(password);
            db.collection(userDB).insert({ 
                    "username": username,
                    "hash": password,
                    "email": email
                }, function(err){
                    if(err){
                        res.send("Error processing request");
                    }else{
                        return res.render('register', {
                            message:"Go to login to sign in",
                            type: "success"
                        }); 
                    }
                }
            );
        }
    })
});

router.get('/logout', function(req, res, next) {
    req.logout();
	res.redirect('/login');
});

// ============== authorized users only ===================
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        req.user.loggedIn = true;
        return next(); 
    }
    res.redirect('/login')
}

router.use(ensureAuthenticated);

//if it is a success send them this
router.get('/profile',  function(req, res, next) {
    console.log(req.message)
	res.render('profile', parameterGen(req));
});

//little secret for the ladies ;)
router.get(
    '/lounge',
    ensureAuthenticated, 
    function(req,res,next){
        res.send("you found it baby.") 
    }
);

module.exports = router;
