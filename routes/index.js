var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/addScreen', function(req, res, next){
	res.render('addScreen', {title: 'Test calculator'});
});

router.get('/addscreen', function(req, res, next) {
  res.render('addScreen', { title: 'Add Screen' });
});

module.exports = router;
