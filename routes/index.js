var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:classRoom', function(req, res, next) {
    res.render('profesor', { classRoom: req.params.classRoom });
});

module.exports = router;
