var express = require('express');
var router = express.Router();

router.get('/testUrl', function(req, res, next) {
    try {
        var testUrl = req.query.testUrl;

        var request = require('request');
        request(testUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(response);
                return res.status(200).send({testUrl: testUrl, searchId: req.query.searchId});
            } else {
                console.log(testUrl);
                return res.status(500).send("err");
            }
        });
    } catch (err) {
        return res.status(500).send("err");
    }

});

module.exports = router;
