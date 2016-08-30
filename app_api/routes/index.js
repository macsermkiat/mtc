var express = require('express');
var router = express.Router();
// var fs     = require('fs');
// var multer = require('multer');
// var upload = multer({ dest: function (req, file, cb) {
//  cb(null, './uploads/');
//     },
//  filename: function (req, file, cb) {
//     var originalname = file.originalname;
//     var extension = originalname.split(".");
//     filename = Date.now() + '.' + extension[extension.length-1];
//     cb(null, filename);
//   }
// });


// var path = require('path');
// var serveStatic = require('serve-static');
// var app = express();

var ctrlCoaches = require('../controllers/coach');
// var nodeMail = require('../controllers/nodemail');

// app.use(serveStatic(./public));
// app.use(serveStatic(path.join(__dirname, './public')));
// app.use(serveStatic(path.join(__dirname, '../../app_client')));

// Coaches
// router.get('/coaches', ctrlCoaches.coachesBrowse);
router.post('/coaches', ctrlCoaches.coachesCreate);
router.get('/allcoaches', ctrlCoaches.coachesBrowse);
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

// Newsletter
router.post('/newsletter', ctrlCoaches.eMailNewsLetterCollect);

module.exports = router;