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

app.use(function(req, res, next) {
    if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + req.get('Host') + req.url);
    }
    else
        next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'node_modules')));
app.use(serveStatic(path.join(__dirname, 'app_client')));


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


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

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


module.exports = app;