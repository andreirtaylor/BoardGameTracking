var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addscreen', function(req, res, next) {
  res.render('addScreen', { title: 'Add Screen' });
});

module.exports = router;
