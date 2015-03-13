var express = require('express');
var router = express.Router();
var gameREGEX = /[0-9]{4}-[\w]{2}-[\w]{2}/;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/users/');
});

//forward people who put in the room without the game screen
router.get(gameREGEX, function(req, res, next) {
    res.redirect('/users/gamescreen/?room='+ gameREGEX.exec(req.url));
});

router.get('/login', function(req, res, next) {
	res.redirect('/users/login');
});

router.get('/logout', function (req, res, next) {
    console.log(req.session.user_id);
	res.redirect('/users/logout');
});

router.get('/register', function(req, res, next) {
	res.redirect('/users/register');
});

router.get('/newgame', function(req, res, next){
    res.redirect('users/newgame');
});

router.get('/profile',  function(req, res, next) {
	res.redirect('/users/profile');
});

module.exports = router;
