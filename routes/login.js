//var express = require('express');
var router = require('express').Router();

//authentication dependencies
var passport = require('passport');

router.get('/', function(req, res, next) {
	res.render('login', { layout: "loginLayout"});
});

//when they send the login info determine if it is a
//success or failure
router.post('/',
  passport.authenticate('local', {
    successRedirect: '/login/loginSuccess',
    failureRedirect: '/login/loginFailure'
  })
);



//if its a failure send them this
router.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

//if it is a success send them this
router.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

module.exports = router;
