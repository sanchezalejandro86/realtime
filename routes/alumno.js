var express = require('express');
var router = express.Router();
var Clases = require('../model/clase');

/* GET users listing. */
router.get('/:classRoom/:locked?', function(req, res, next) {

    if (req.params.locked === undefined)
        req.params.locked = false;

    var classRoom = req.params.classRoom;

    Clases.getClase(classRoom,
        function(d){
            res.render('alumno', {
                classRoom: req.params.classRoom,
                messages: JSON.stringify(d),
                locked: req.params.locked
            });
        });
});

/*function jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}*/

module.exports = router;
