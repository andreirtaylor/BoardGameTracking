//var express = require('express');
var router = require('express').Router();

//authentication dependencies
var passport = require('passport');

// redirect the user if they are logged in
function testAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        req.user.loggedIn = true;
        res.redirect('/profile'); 
    }else{
        next();
    }
}

router.get('/', function(req, res, next) {
	res.redirect('/login');
});

router.get(
    '/login', 
    testAuthenticated,
    function(req, res, next) {
	    res.render('login');
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/users/loginFailure'
  })
);

//if its a failure send them this
router.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
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
    //check for valid email
    var re = /^[\w.]+@[\w.].[\w]+$/
    if(!re.test(email)){
        res.send("Invalid email");
        return;
    }
    //check for duplicates in the database
    db.collection(userDB).findOne({ 'username': username }, function (err, user){
        if(err){
            res.send('Error processing request');
        }
        else if(user){
            res.send('username is taken');
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
                        res.send("Go to login to sign in")
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

function parameterGen(user){
    return {
        loggedIn: user.loggedIn,
        username: user.username
    }
}

//if it is a success send them this
router.get('/profile',  function(req, res, next) {
	res.render('profile', parameterGen(req.user));
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
