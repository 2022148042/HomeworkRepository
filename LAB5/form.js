var express = require('express');
var router = express.Router();

router.get('/tmp/form', function(req, res, next) {
    res.render('form', {title : 'Form 테스트'});
});

router.post('/tmp/form',function(req, res, next){
    res.json(req.body);}
);

module.exports = router;