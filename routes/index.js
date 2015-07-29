var express = require('express');
var router = express.Router();
var Clases = require('../model/clase');

/* GET home page. */
router.get('/class/:classRoom', function(req, res, next) { //--TODO con '?' el parametro es opcional
    Clases.getClase(17, function(d){ res.render('profesor', { classRoom: req.params.classRoom, messages: JSON.stringify(d) }); });
});

module.exports = router;
