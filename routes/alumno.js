var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:classRoom', function(req, res, next) {
    res.render('alumno', { classRoom: req.params.classRoom });
});

module.exports = router;
