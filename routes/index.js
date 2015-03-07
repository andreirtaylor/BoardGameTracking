var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});


router.get('/samplegame', function(req, res, next){
    res.render('index', {});
});

router.get('/addScreen/:id', function(req, res, next){
    idNum = req.params.id;
	res.render('addScreen', {
        title: 'Test calculator',
        id: idNum
    });
});

router.get('/addScreen', function(req, res, next){
	res.render('addScreen', {title: 'Test calculator'});
});

module.exports = router;
