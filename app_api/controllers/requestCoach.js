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
	var fee = (req.body.price-10)*10/100;
	retrieveUser(req.body.createdBy, function(err,user) {
		if (err) {
			console.log(err);
		}
		console.log('The user created this subject is' + user);
		userEmail = user.email;
		userName = user.name;
		userTelephone = user.telephone;
		userLine = user.lineid;
	})

	var sendAwsSns = function(req, res) {
		var params = {
		  Message: 'You got a matching request. Please check Email at ' + userEmail
		            + ' or contact MatchTheCoach',
		  MessageStructure: 'string',
		  PhoneNumber: '+66' + userTelephone
		};
		var studentSms = {
		  Message: 'Thank you for request a coach. We will contact you shortly after the coach response.',
		  MessageStructure: 'string',
		  PhoneNumber: '+66' + req.body.phone
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
		sns.publish(studentSms, function(err, data) {
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
			       <p>Student's level: ${req.body.level}</p>
			       <p>Student's goal: ${req.body.goal}</p>
			       <p>Time: ${req.body.time}</p>
			       <p>Place: ${req.body.place}</p>
			       <p>Requestid: ${req.body.requestid}</p>
			       <p>Matching fee: ${req.body.coachMatchingFee} baht.</p>
			       <p>กรุณาตอบกลับ Email ฉบับนี้ว่าท่านสะดวกสอนในวันเวลา\nดังกล่าวหรือไม่</p>
			       <p>ถ้าท่านตอบตกลง\nเราจะติดต่อท่านอีกครั้ง\nเมื่อนักเรียนได้ชำระค่าธรรมเนียม\nท่านจึงชำระค่าธรรมเนียมการแมทช์\nหลังจากนั้น</p>
			       <p>ถ้าท่านมีปัญหาการใช้งาน หรือมีคำถาม สามารถติดต่อเราได้ทุกช่องทาง</p>
			       <p>Please reply this Email back as soon as possible of your answer to accept the match or not.</p>
			       <p>If you accept to match, we will contact you shortly when the student confirm matching. Please do not transfer matching fee before that</p>
			       <p>If you have a question, please do not hesitate to contact us</p>
			       <p>LINE ID : @matchthecoach (need '@')</p>
			       <p>Regards</p>
			       <hr>
				   <div id="WISESTAMP_SIG_22e21843e5bf46e433fdcc778ada4935" href="http://WISESTAMP_SIG_22e21843e5bf46e433fdcc778ada4935"><div><div style="max-width:600px;  direction: ltr; " class="main_html date__2016_11_21___15_30"><div class="html wisestamp_app main_sig" id="tp1s" style="max-width: 485px;"> <table border="0" cellspacing="0" cellpadding="0" width="485" style="width: 485px;"> <tbody><tr valign="top"> <td style="width: 10px; padding-right:10px;"> <img src="https://s3.amazonaws.com/ucwebapp.wisestamp.com/94a44911-1bc0-468c-86ba-40fc7dedbeba/14690951_1667850066877578_4424.format_png.resize_200x.png#logo" width="65" height="65" alt="photo" style="border-radius:4px;moz-border-radius:4px;khtml-border-radius:4px;o-border-radius:4px;webkit-border-radius:4px;ms-border-radius: 4px;width:65px;height:65px;max-width: 120px;"> </td> <td style="border-right: 1px solid #C01A5C;"></td> <td style="display: inline-block; text-align:initial; font:12px Arial;color:#646464;padding:0 10px"> <table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td> <b class="text-color theme-font">MatchTheCoach</b><br>  <span style="display: inline-block;">Royyak Co.,Ltd</span> </td> </tr> <tr> <td style="color:#8d8d8d;font-size:12px;padding:5px 0"> <span style="display:inline-block;"><a href="mailto:matchthecoach@royyak.com" style="display: inline-block; color:#8d8d8d;text-decoration: none;">matchthecoach@royyak.com</a></span>  <span style="color: #C01A5C;display:inline-block;">|</span> <span style="white-space: nowrap;display:inline-block;"><a href="https://line.me/R/ti/p/%40matchthecoach" rel="nofollow" target="_blank" style="display: inline-block; color:#8d8d8d;text-decoration: none;">LINE ID : @matchthecoach</a></span> </td> </tr> <tr> <td style="margin-top: 5px"><a href="http://facebook.com/matchTcoach" target="_blank"><img style="border-radius:0;moz-border-radius:0;khtml-border-radius:0;o-border-radius:0;webkit-border-radius:0;ms-border-radius:0;border: 0;width:16px; height:16px;" width="16" height="16" src="https://s3.amazonaws.com/images.wisestamp.com/icons_32/facebook.png"></a>&nbsp;<a href="http://instagram.com/matchthecoach" target="_blank"><img style="border-radius:0;moz-border-radius:0;khtml-border-radius:0;o-border-radius:0;webkit-border-radius:0;ms-border-radius:0;border: 0;width:16px; height:16px;" width="16" height="16" src="https://s3.amazonaws.com/images.wisestamp.com/icons_32/instagram.png"></a></td> </tr> </tbody></table> </td> </tr> </tbody></table> </div><div style="clear:both;height:0!important"></div><a class="wisestamp_app facebook_button" style="margin:8px 8px 0 0;display: inline-block;vertical-align: bottom;" href="https://www.facebook.com/matchTcoach" target="_blank"><img src="https://s3.amazonaws.com/images.wisestamp.com/apps/facebook_like.png"></a><div href="http://WS_promo" id="WS_promo" style="width: auto; padding-top: 2px; font-size: 10px; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(238, 238, 238); margin-top: 10px;display:table; direction: ltr; line-height: normal; border-spacing: initial;"> <img src="http://ws-promos.appspot.com/ga/pixel.png?dont_count=1&amp;e=5732568548769792" style="display:block"> <div class="promo-placeholder" style="padding-top:2px;"> 
				   </div> </div></div></div></div>
			       `		       
		};
		
		var mailToAdmin = {
		   from: "matchthecoach@royyak.com", // sender address.  Must be the same as authenticated user if using Gmail.
		   to: "matchthecoach@royyak.com",
		   subject: "Request matching from Match The Coach. ID: " + req.body.requestid, // subject
		   text: "Alert! There's a matching request." + req.body.time + '\n\nplace :' + req.body.place,
		   html: `<h2 style='color: #006600'>Coach name: ${userName}.</h2>
		   		  <h3>Coach telephone: ${userTelephone}</h3>
		   		  <h3>Coach LINE : ${userLine}</h3>
		   		  <h3>Alert! there's a matching request.</h3>
			       <p>Course: ${req.body.shortDescription}</p>
			       <p>Student's name: ${req.body.name}</p>
			       <p>Student's id: ${req.body.identity}</p>
			       <p>Student's level: ${req.body.level}</p>
			       <p>Student's goal: ${req.body.goal}</p>
			       <p>Student's email: ${req.body.email}</p>
			       <p>Student's telephone: ${req.body.phone}</p>
			       <p>Student's gender: ${req.body.sex}</p>
			       <p>Time: ${req.body.time}</p>
			       <p>Place: ${req.body.place}</p>
			       <p>Requestid: ${req.body.requestid}</p>
			       <p>Coach Matching fee: ${req.body.coachMatchingFee} baht.</p>
			       <p>Student Matching fee: ${req.body.studentMatchingFee} baht.</p>
			       <h4>**Student detail**</h4>
			      
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