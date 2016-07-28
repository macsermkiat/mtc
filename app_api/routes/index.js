var express = require('express');
var router = express.Router();

var ctrlCoaches = require('../controllers/coach');

router.get('/coaches', ctrlCoaches.coachesListByDistance);

router.get('/coaches/:coachid', ctrlCoaches.coachesReadOne);

module.exports = router;