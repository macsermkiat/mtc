var nodemailer = require("nodemailer");
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


module.exports.sendEMail = function(req, res) {
	

	var mailOptions = {
	   from: "macsermkiat@gmail.com", // sender address.  Must be the same as authenticated user if using Gmail.
	   to: "macsermkiat@yahoo.com", // receiver
	   subject: "Emailing with nodemailer", // subject
	   text: "Hello!! Test" // body
	}; 

	transporter.sendMail(mailOptions, function(error, info){  //callback
	   if(error){
	       console.log(error);
	       return sendJSONresponse(res, 404, error);
	   }else{
	       console.log("Message sent: " + info.response);
	       return sendJSONresponse(res, 200, info);
	   };

	});
	   
};