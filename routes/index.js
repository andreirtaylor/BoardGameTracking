var express = require('express');
var router = express.Router();
var gameREGEX = /[0-9]{4}-[\w]{2}-[\w]{2}/;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express'});
});

//forward people who put in the room without the game screen
router.get(gameREGEX, function(req, res, next) {
    res.redirect('gamescreen/?room='+ gameREGEX.exec(req.url));
});

router.get('/login', function(req, res, next) {
	res.redirect('/users/login');
});

router.get('/register', function(req, res, next) {
	res.redirect('/users/register');
});

router.get('/samplegame', function(req, res, next){
    res.render('samplegame', {});
});

router.get('/newgame', function(req, res, next){
    res.render('newgame', {});
});

router.get('/gamescreen', function(req, res, next){
	res.render('gamescreen', {title: 'Test calculator'});
});

module.exports = router;
