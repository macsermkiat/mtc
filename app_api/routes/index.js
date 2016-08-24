var express = require('express');
var router = express.Router();
// var path = require('path');
// var serveStatic = require('serve-static');
// var app = express();

var ctrlCoaches = require('../controllers/coach');

// app.use(serveStatic(./public));
// app.use(serveStatic(path.join(__dirname, './public')));
// app.use(serveStatic(path.join(__dirname, '../../app_client')));

// Coaches
// router.get('/coaches', ctrlCoaches.coachesBrowse);
router.post('/coaches', ctrlCoaches.coachesCreate);
router.get('/coaches/search/', ctrlCoaches.keywordSearch);
router.get('/coaches/:coachid', ctrlCoaches.coachesReadOne);
router.put('/coaches/:coachid', ctrlCoaches.coachesUpdateOne);
router.delete('/coaches/:coachid', ctrlCoaches.coachesDeleteOne);
// router.get('/coachesParent', ctrlCoaches.coachesParent);

// Category
// router.get('/category', ctrlCoaches.categoryRead);

// router.get('/main', function(req,res) {
// 	res.sendFile(path.join(__dirname, '../../app_client', 'main.html'))
// });

module.exports = router;