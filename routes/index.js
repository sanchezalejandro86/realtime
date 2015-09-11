var express = require('express');
var router = express.Router();
var Clases = require('../model/clase');
var node_ip = require("ip");

/* GET home page. */
router.get('/class/:classRoom/:prof?', function(req, res, next) {
    var classRoom = req.params.classRoom;

    Clases.createClass(classRoom);

    Clases.getClase(classRoom,
        function(d){
            res.render('profesor', {
                classRoom: classRoom,
                messages: JSON.stringify(d[0].messages),
                locked: false,
                port: process.env.PORT,
                ip: node_ip.address()
            });
        });
});

router.get('/ping', function(req, res, next){
    res.status(204).send();
});

router.get('/', function(req, res, next){
    res.render('home');
});

module.exports = router;
