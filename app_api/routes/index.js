var express = require('express');
var router = express.Router();

// var path = require('path');
// var serveStatic = require('serve-static');
// var app = express();

var aws = require('../controllers/awsPolicy');
var ctrlCoaches = require('../controllers/coach');
var ctrlRequest = require('../controllers/requestCoach');
var ctrlNews = require('../controllers/sendNewsLetter');
var ctrlTwit = require('../controllers/twit');

// var nodeMail = require('../controllers/nodemail');

// AWS
router.get('/awsPolicy', aws.getS3Policy);

// Coaches
// router.get('/coaches', ctrlCoaches.coachesBrowse);
router.post('/coaches', ctrlCoaches.coachesCreate);
router.get('/allcoaches', ctrlCoaches.coachesBrowse);
router.get('/allcats', ctrlCoaches.allCats);
router.get('/coaches/searchCat', ctrlCoaches.categorySearch);
router.get('/coaches/search/', ctrlCoaches.keywordSearch);
router.get('/coaches/:coachid', ctrlCoaches.coachesReadOne);
router.get('/user/:userid', ctrlCoaches.coachBio);
// router.put('/coaches/:coachid', ctrlCoaches.coachesUpdateOne);
router.delete('/coaches/:coachid', ctrlCoaches.coachesDeleteOne);

// User
router.get('/users/course', ctrlCoaches.usersCourse);
router.get('/users/bio', ctrlCoaches.usersBio);
router.post('/users/create', ctrlCoaches.usersCreate);
router.put('/users/update', ctrlCoaches.usersUpdate);
router.get('/coachEdit/:coachid', ctrlCoaches.coachesUpdateOne);
router.put('/coachEdit/update', ctrlCoaches.coachesUpdateOne);

// router.get('/coachesParent', ctrlCoaches.coachesParent);

// Category
// router.get('/category', ctrlCoaches.categoryRead);

// router.get('/main', function(req,res) {
// 	res.sendFile(path.join(__dirname, '../../app_client', 'main.html'))
// });

// Newsletter
router.post('/newsletter', ctrlCoaches.eMailNewsLetterCollect);
router.post('/sendNews', ctrlNews.sendFirstEmail);

// Twitter bot
// router.get('/twit', ctrlTwit.twitGet);
// router.post('/tweet', ctrlTwit.twitPost);
// Request
router.post('/request', ctrlRequest.requestCoach);
module.exports = router;