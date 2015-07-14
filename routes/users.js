var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.render('client', { profesor: '0' });
  res.render('alumno');
});

module.exports = router;
