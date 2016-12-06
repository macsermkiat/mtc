(function() {

var Twit = require('twit');

var T = new Twit({
  consumer_key:         process.env.TWIT_KEY,
  consumer_secret:      process.env.TWIT_SECRET,
  access_token:         process.env.TWIT_TOKEN,
  access_token_secret:  process.env.TWIT_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


	module.exports.twitGet = function(req, res) {
		console.log(req.query);
		var text = req.query.text;
		var date = req.query.date;
		var lang = text +" ";
		var date = "since:" + date;
		var langdate = "'"+lang+date+"'";
		console.log(langdate);

		//
		//  tweet 'hello world!'
		//
		// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
		//   console.log(data)
		// })

		//
		//  search twitter for all tweets containing the word 'banana' since July 11, 2011
		//
		T.get('search/tweets', { q: langdate, count:50 }, function(err, data, response) {
		   if (err) {
              sendJSONresponse(res, 404, err);
              return;
            } else {          
	          sendJSONresponse(res, 200, data);
        	}
		})
	};

	module.exports.twitPost = function(req, res) {
		var opts = {
		    in_reply_to_status_id: req.body.id  ,
		    status: '@' + req.body.name + ' ' + req.body.tweet
		  };
		T.post('statuses/update', opts, function(err, data, response) {
		   if (err) {
              sendJSONresponse(res, 404, err);
              return;
            } else {          
	          sendJSONresponse(res, 200, data);
        	}
		})
	};


})();