var express = require('express');
var router = express.Router();
var Clases = require('../model/clase');

/* GET calendar page. */
router.get('/', function(req, res, next) { //--TODO con '?' el parametro es opcional
    //var classRoom = req.params.classRoom;
    //
    //Clases.createClass(classRoom);
    //
    //Clases.getClase(classRoom,
    //    function(d){
    //        res.render('profesor', { classRoom: classRoom,
    //            messages: JSON.stringify(d) });
    //        //messages: jsonEscape(JSON.stringify(d)) });
    //    });
    res.render('calendar');
});
module.exports = router;
