var express = require('express');
var router = express.Router();
var Clases = require('../model/clase');

/* GET home page. */
router.get('/class/:classRoom/:prof?', function(req, res, next) {
    var classRoom = req.params.classRoom;

    Clases.createClass(classRoom);

    Clases.getClase(classRoom,
        function(d){
            res.render('profesor', {
                classRoom: classRoom,
                messages: JSON.stringify(d[0].messages),
                locked: false
            });
        });
});

module.exports = router;
