var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/mtc';
if (process.env.NODE_ENV === 'production') {
    dbURI = 'mongodb://macsermkiat:017338373@http://ec2-54-169-217-40.ap-southeast-1.compute.amazonaws.com:27017/mtc';
}

mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

// SIGINTT for Windows
var readLine = require ("readline");
if (process.platform === "win32"){
	var rl = readLine.createInterface ({
		input: process.stdin,
		output: process.stdout
	});
	rl.on ("SIGINT", function (){
	process.emit ("SIGINT");
	});
}

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
        process.exit(0);
    });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./coach');
require('./users');
