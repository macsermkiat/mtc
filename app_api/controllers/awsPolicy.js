var crypto = require("crypto");
var moment = require("moment");
var config = require("./amazonConfig.js")


var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

createS3Policy = function( callback) {
      var s3Policy = {
            "expiration": "2020-01-01T00:00:00Z",
            "conditions": [

                {"bucket": "matchthecoach"},
                ["starts-with", "$key", ""],
                {"acl": "public-read"},
                ["starts-with", "$Content-Type", ""],
                ["starts-with", "$filename", ""],
                ["content-length-range", 0, 524288000]
            ]
        };

      // stringify and encode the policy
      var accessKeyId  = config.obj.accessKeyId;
      var stringPolicy = JSON.stringify(s3Policy);
      var base64Policy = Buffer(stringPolicy, "utf8").toString("base64");

      // sign the base64 encoded policy

      var signature = crypto.createHmac("sha1", config.obj.secretKey)
        .update(new Buffer(base64Policy, "utf8")).digest("base64");

      // build the results object
      var s3Credentials = {
        s3AccessKeyId : accessKeyId,
        s3Policy: base64Policy,
        s3Signature: signature
      };

      // send it back
      callback(s3Credentials);

};  

exports.getS3Policy = function(req, res) {
    createS3Policy( function (creds, err) {
        if (!err) {
            return sendJSONresponse(res, 200, creds);
        } else {
            return sendJSONresponse(res, 404, err);
        }
    });
};


