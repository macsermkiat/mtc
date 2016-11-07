var mongoose = require('mongoose');
var Mtc = mongoose.model('Coach');
// var Cat = mongoose.model('Category');
var User = mongoose.model('User');
// var Mail = mongoose.model('EmailNewsLetter');
var async = require('async');
var nodemailer = require("nodemailer");
var AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-1';

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASS
        }
});
module.exports.requestCoach = function(req, res) {

	var sendAwsSns = function(req, res) {
		var params = {
		  Message: 'You got a matching request. Please check Email at ' + req.body.email
		            + ' or contact MatchTheCoach',
		  MessageStructure: 'string',
		  PhoneNumber: '+66' + userTelephone
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
		  	// return sendJSONresponse(res, 500, err);
		  	return err;
		     // an error occurred
		  } else {
		  	console.log(data);           // successful response
			// return sendJSONresponse(res, 200, data);
		  }    
		});
	};


	function retrieveUser(identity, callback) {
	  User.find({identity: identity}, function(err, users) {
	    if (err) {
	      callback(err, null);
	    } else {
	      callback(null, users[0]);
	    }
	  });
	};
	var userEmail;
	var userName;
	var userTelephone;
	var fee = req.body.price*10/100;
	retrieveUser(req.body.createdBy, function(err,user) {
		if (err) {
			console.log(err);
		}
		console.log('The user created this subject is' + user);
		userEmail = user.email;
		userName = user.name;
		userTelephone = user.telephone;
	})

	var sendEMail = function(req, res) {
		var mailOptions = {
		   from: "matchthecoach@royyak.com", // sender address.  Must be the same as authenticated user if using Gmail.
		   to: userEmail, // receiver
		   subject: "Request matching from Match The Coach. ID: " + req.body.requestid, // subject
		   text: "Congratulation! You have a matching request." + req.body.time + '\n\nplace :' + req.body.place,
		   html: `<h2 style='color: #006600'>Hi ${userName}.</h2>
		   		  <h3>Congratulations! there's a matching request for you.</h3>
			       <p>Course: ${req.body.shortDescription}</p>
			       <p>Student's gender: ${req.body.sex}</p>
			       <p>Time: ${req.body.time}</p>
			       <p>Place: ${req.body.place}</p>
			       <p>Requestid: ${req.body.requestid}</p>
			       <p>Matching fee: ` + fee +` baht.</p>
			       <p>กรุณาตอบกลับ Email ฉบับนี้ว่าท่านสะดวกสอนในวันเวลา\nดังกล่าวหรือไม่</p>
			       <p>ถ้าท่านตอบตกลง\nเราจะติดต่อท่านอีกครั้ง\nเมื่อนักเรียนได้ชำระค่าธรรมเนียม\nท่านจึงชำระค่าธรรมเนียมการแมทช์\nหลังจากนั้น</p>
			       <p>ถ้าท่านมีปัญหาการใช้งาน หรือมีคำถาม สามารถติดต่อเราได้ทุกช่องทาง<p>
			       <p>Please reply this Email back as soon as possible of your answer to accept the match or not.</p>
			       <p>If you accept to match, we will contact you shortly when the student confirm matching. Please do not transfer matching fee before that<p>
			       <p>If you have a question, please do not hesitate to contact us<p>
			       <p>Regards
			       <hr>
			       <h2>Match the Coach team</h2>
			       <h3>Royyak Co.,Ltd.</h3>
			       <p>facebook</p><span><a href="http://www.facebook.com/matchTcoach">MatchTheCoach</a></span>
			       <h3>Tel: 095-5073078</h3>`		       
		};
		
		var mailToAdmin = {
		   from: "matchthecoach@royyak.com", // sender address.  Must be the same as authenticated user if using Gmail.
		   to: "matchthecoach@royyak.com",
		   subject: "Request matching from Match The Coach. ID: " + req.body.requestid, // subject
		   text: "Congratulation! You have a matching request." + req.body.time + '\n\nplace :' + req.body.place,
		   html: `<h2 style='color: #006600'>Hi ${userName}.</h2>
		   		  <h3>Congratulations! there's a matching request for you.</h3>
			       <p>Course: ${req.body.shortDescription}</p>
			       <p>Student's gender: ${req.body.sex}</p>
			       <p>Time: ${req.body.time}</p>
			       <p>Place: ${req.body.place}</p>
			       <p>Requestid: ${req.body.requestid}</p>
			       <p>Matching fee: ` + fee +` baht.</p>
			       <h4>**Student detail**</h4>
			       <p>Name: ${req.body.nameOfStudent}</p>
			       <p>Telephone: ${req.body.phone}</p>
			       <p>Eail: ${req.body.email}</p>
			       <p>กรุณาตอบกลับ Email ฉบับนี้ว่าท่านสะดวกสอนในวันเวลา\nดังกล่าวหรือไม่</p>
			       <p>ถ้าท่านตอบตกลง\nเราจะติดต่อท่านอีกครั้ง\nเมื่อนักเรียนได้ชำระค่าธรรมเนียม\nท่านจึงชำระค่าธรรมเนียมการแมทช์\nหลังจากนั้น</p>
			       <p>ถ้าท่านมีปัญหาการใช้งาน หรือมีคำถาม สามารถติดต่อเราได้ทุกช่องทาง<p>
			       <p>Please reply this Email back as soon as possible of your answer to accept the match or not.</p>
			       <p>If you accept to match, we will contact you shortly when the student confirm matching. Please do not transfer matching fee before that<p>
			       <p>If you have a question, please do not hesitate to contact us<p>
			       <p>Regards
			       <hr>
			       <h2>Match the Coach team</h2>
			       <h3>Royyak Co.,Ltd.</h3>
			       <p>facebook</p><span><a href="http://www.facebook.com/matchTcoach">MatchTheCoach</a></span>
			       <h3>Tel: 095-5073078</h3>`		       
		}; 


		transporter.sendMail(mailOptions, function(error, info){  //callback
		   if(error){
		       console.log(error);
		       return sendJSONresponse(res, 404, error);
		   }else{
		       console.log("Message sent to " + userEmail + " : " + info.response);
		       transporter.sendMail(mailToAdmin, function(error, info){  //callback
				   if(error){
				       console.log(error);
				       
				   }else{
				       console.log("Message sent to Admin");    
				   };

				});
		       return sendJSONresponse(res, 200, info);
		   };

		});


		   
	};
	

	 
                //     Mtc.update({ _id: req.body.coachid },
                //     {$push: {requested: req.body.requestid}},{upsert:true}
                //     ,function(err)   {
                //       if (err) {
                //         console.log(err);
                //       }else{
                //         console.log("Success add request in CoachSchema");
                //       }
                //     })
                // ;

    setTimeout(function() {
     async.parallel ([       
        function(cb) {       
          User.findOne({ identity: req.body.identity })
                 .exec(function (err) {
                    User.update({ identity: req.body.identity },
                    {$push: {requestToMatch: req.body.requestid}},{upsert:true}
                    ,function(err)   {
                      if (err) {
                        console.log(err);
                        
                      }else{
                        console.log("Success add in UserSchema");
                      }
                    })
                });
        },
        function(cb) {       
          Mtc.findOne({ _id: req.body.coachid })
                 .exec(function (err) {
                    Mtc.update({ _id: req.body.coachid },
                    {$push: {requested: req.body.requestid}},{upsert:true}
                    ,function(err)   {
                      if (err) {
                        console.log(err);
                        
                      }else{
                        console.log("Success add request in CoachSchema");
                      }
                    })
                });
        },
        function(cb) {      
          sendAwsSns(req, res), function(err)   {
                      if (err) {
                        console.log(err);
                      }else{
                        console.log("Success send SMS");
                      }
          }
        },
        function(cb) {      
          sendEMail(req, res), function(err)   {
                      if (err) {
                        console.log(err);
                        
                      }else{
                        console.log("Success send Email");
                      }
          }
        }
      ], function(err, coach) {
      	console.log("The coach is" + coach);
      	console.log("The error is" + err)
        if (err) {
          
          sendJSONresponse(res, 400, err);
        } else {
          console.log(coach + "save done");
          sendJSONresponse(res, 201, coach);
        }
      }
     );
 	},1000);
};