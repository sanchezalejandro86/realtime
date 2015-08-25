var express = require('express');
var router = express.Router();
var Clases = require('../model/clase');
var node_ip = require("ip");

/* GET users listing. */
router.get('/:classRoom/:locked?', function(req, res, next) {

    if (req.params.locked === undefined || req.params.locked == "false")
        req.params.locked = false;

    var classRoom = req.params.classRoom;

    Clases.getClase(classRoom,
        function(d){
            res.render('alumno', {
                classRoom: req.params.classRoom,
                messages: JSON.stringify(d[0]? d[0].messages : {}),
                locked: req.params.locked,
                port: process.env.PORT,
                ip: node_ip.address()
            });
        });
});

module.exports = router;
