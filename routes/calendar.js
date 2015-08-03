var express = require('express');
var router = express.Router();
var Clases = require('../model/clase');

/* GET calendar page. */
router.get('/', function(req, res, next) {
    Clases.getClases(
        function (e, d) {
            var result = {};

            d.forEach(
                function (e) {
                    var d = new Date(e.date),
                        month = parseInt(d.getMonth()) + 1,
                        key =
                            (month < 10 ? '0' + month : month) + '-' +
                            (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' +
                            d.getFullYear();

                    if (result[key] == undefined)
                        result[key] = e.clase_id;
                    else
                        result[key] = result[key] + ',' + e.clase_id;
                }
            );

            return res.render('calendar', { events: JSON.stringify(result)});
        }
    )
});

module.exports = router;
