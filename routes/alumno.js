var express = require('express');
var router = express.Router();
var Clases = require('../model/clase');

/* GET users listing. */
router.get('/:classRoom', function(req, res, next) {
    Clases.getClase(17, function(d){ res.render('alumno', { classRoom: req.params.classRoom, messages: JSON.stringify(d) }); });
});

module.exports = router;
