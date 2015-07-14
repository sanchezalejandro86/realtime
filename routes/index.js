var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('profesor', { profesor: '1' });
});

module.exports = router;
