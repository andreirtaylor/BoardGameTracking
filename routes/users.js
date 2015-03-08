//var express = require('express');
var router = require('express').Router();

//authentication dependencies
var passport = require('passport');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

router.get('/lounge', 
    ensureAuthenticated, 
    function(req,res,next){
        res.send("you found it baby.") 
});

router.get('/', function(req, res, next) {
	res.render('login', { layout: "loginLayout"});
});


router.get('/login', function(req, res, next) {
	res.redirect('/users');
});

router.get('/register', function(req, res, next) {
	res.render('register', { layout: "loginLayout"});
});

router.post('/register', function(req, res, next) {
    //make a new user
    // defined in the main app
    var userDB = req.userDB;
    var db = req.db;
    var passwordHash = req.passwordHash;
    // get the username and password
    var username = req.body.username;
    var password = req.body.password;
    // make sure that the username and password exist
    if(req.userName && req.password){
        res.send("Both boxes must contain something");
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
                    "hash": password
                }, function(err){
                    if(err){
                        res.send("Error processing request");
                    }else{
                        res.send("Go to login to sign in")
                    }
            });
        }
    })
});

//when they send the login info determine if it is a
//success or failure
router.post('/',
  passport.authenticate('local', {
    successRedirect: '/users/loginSuccess',
    failureRedirect: '/users/loginFailure',
    failureFlash: true,
    successflash: 'one moment please'
  })
);

//if its a failure send them this
router.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

//if it is a success send them this
router.get('/loginSuccess',  function(req, res, next) {
  res.send('Successfully authenticated');
});

module.exports = router;
