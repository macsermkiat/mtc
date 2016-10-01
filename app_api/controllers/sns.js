(function() {
var AWS = require('aws-sdk');

AWS.config.region = 'ap-southeast-1';

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


module.exports.sendAwsSns = function(req, res) {
	var params = {
	  Message: 'this is a test message',
	  MessageStructure: 'string',
	  PhoneNumber: '+66955073078'
	};
	var sns = new AWS.SNS();
    
    sns.setSMSAttributes({
    	attributes: {DefaultSenderID: 'MatchTCoach'}
    }, function(err,data) {
    	if (err) {
	  	console.log(err, err.stack);
	  } else {
	  	console.log(data);
	  }
    });
    

	sns.publish(params, function(err, data) {
	  if (err) {
	  	console.log(err, err.stack);
	  	// return sendJSONresponse(res, 404, error);
	     // an error occurred
	  } else {
	  	console.log(data);           // successful response
	  	// return sendJSONresponse(res, 200, data);
	  }    
	});
};
})();