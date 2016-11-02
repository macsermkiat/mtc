require('dotenv').config();
var http = require('http');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var jwt = require('express-jwt');
var AWS = require('aws-sdk');
var uglifyJs = require("uglify-js");
var fs = require('fs');
// var wellknown = require("nodemailer-wellknown");


var authCheck = jwt({
    secret: new Buffer(process.env.AUTH_SECRET, 'base64'),
    audience: process.env.AUTH_AUDIENCE
});


require('./app_api/models/db');

var app = express();

var router = express.Router();
var routesApi = require('./app_api/routes/index');




// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'ejs');

// app.use(function(req, res, next) {
//     if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
//         res.redirect('https://' + req.get('Host') + req.url);
//     }
//     else
//         next();
// });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'node_modules')));
app.use(serveStatic(path.join(__dirname, 'app_client')));
// app.all('/*', function(req, res, next) {
//     // Just send the index.html for other files to support HTML5Mode
//     res.sendFile('./app_client/index.html', { root: __dirname });
//     console.log("send index");

// });

var appClientFiles = [
        './app_client/common/services/mtcData.service.js',
        './app_client/common/services/user.service.js',
        './app_client/common/auth/auth.service.js',
        './app_client/home/home.controller.js',
        './app_client/home/email/emailModal.controller.js',
        './app_client/common/request/requestModal.controller.js',
        './app_client/common/profile/initialValue.directive.js',
        './app_client/common/profile/profile.controller.js',
        './app_client/common/profile/profileCourses.controller.js',
        './app_client/common/profile/profileBio.controller.js',
        './app_client/common/profile/profileEdit.controller.js',
        './app_client/common/profile/coachEdit.controller.js',
        './app_client/common/subscription/subscription.controller.js',
        './app_client/common/search/search.controller.js',
        './app_client/common/coachDetail/coachDetail.controller.js',
        './app_client/common/coachDetail/userDetail.controller.js',
        './app_client/common/addCoach/addCoach.controller.js',
        './app_client/common/navigationAndfooter/navigation.directive.js',
        './app_client/common/navigationAndfooter/footerGeneric.directive.js',
        './app_client/home/landing.directive.js',
        './app_client/common/searchbox/searchbox.controller.js',
        './app_client/common/searchbox/searchbox.directive.js',
        './app_client/common/services/awsPolicy.service.js',
        './app_client/common/login/login.controller.js'
    ];
var uglified = uglifyJs.minify(appClientFiles, { compress : false });

fs.writeFile('public/angular/mtc.min.js', uglified.code, function (err){
    if(err) {
    console.log(err);
    } else {
    console.log('Script generated and saved: mtc.min.js');
    }
});


// app.use('/api', authCheck.unless({path:['/api/coaches']}));
app.use('/api', routesApi);
// app.use('/', router);

// app.get('/', function(req, res) {
//     res.sendFile('index.html');
// });
// router.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
// });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});


// error handlers



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// app.all('/*', function(req, res, next) {
//     // Just send the index.html for other files to support HTML5Mode
//     res.sendFile('index.html', { root: __dirname });
//     console.log("send index");

// });
// // serve angular front end files from root path
// router.use('/', express.static('app', { redirect: false }));

// // rewrite virtual urls to angular app to enable refreshing of internal pages
// router.get('*', function (req, res, next) {
//     res.sendFile(path.resolve('/app_client/index.html'));
// });

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// app.listen(8080);
// console.log("Express listen on port 8080");

module.exports = app;