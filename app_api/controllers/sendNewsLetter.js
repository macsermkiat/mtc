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


module.exports.sendFirstEmail = function(req, res) {
	var userEmail = req.body.email

	var mailOptions = {
	   from: "matchthecoach@royyak.com", // sender address.  Must be the same as authenticated user if using Gmail.
	   to: userEmail, // receiver
	   subject: "แนะนำวิธีใช้ และคูปองทดลองฟรี.// Usage introduction and FREE coupon code", // subject
	   html: `<h3>Congratulations!</h3>
	   		  <h3>Here's a free coupon</h3>
			        <p>ทาง MatchTheCoach.com ขอขอบคุณที่ท่านได้ให้ความไว้วางใจที่ลงทะเบียนกับทางเว็บไซต์ 
			        ถ้าท่านต้องการค้นหาครูหรือโค้ชสามารถหาได้จากกล่องค้นหาในหน้าหลัก</p>
					<p>ถ้าท่านต้องการลงประกาศเป็นครูสอนพิเศษ หรือเป็นโค้ช ท่านต้องทำการเปิดคอร์สสอนหลังจากลงทะเบียนข้อมูลส่วนตัวแล้ว ในหน้าโปรไฟล์ มิเช่นนั้นจะค้นหาไม่พบ
					ตามรูปด้านล่าง</p>
					<p>โค้ดคูปองทดลองใช้งานฟรีคือ<p>
					<h3><strong>matchfree</strong></h3>
					<p>เพื่อฟรีค่าธรรมเนียมในการแมทช์ครั้งแรก</p>
					<p>โปรดระบุโค้ดตอบกลับทาง Email เมื่อท่านได้รับการแมทช์</p><br>
					<a href="https://www.matchthecoach.com">เริ่มต้นใช้งานเลย</a><br>
					<p>ขอแสดงความนับถือ</p><br>
					<h2>Match the Coach team</h2>
			        <h3>Royyak Co.,Ltd.</h3>
			        <p>facebook: </p><span><a href="http://www.facebook.com/matchTcoach">MatchTheCoach</a></span>

			        <p>Thank you for interest in our service. 
			        If you want to find a coach or tutor, please use a searchbox in main page.</p>
					<p>If you want to register as a teacher or a coach, please fill in subscription
					form. After that, you have to create a course, or else the students wouldn't see you.</p><br>
					<p>Free coupon code is <strong>matchfree</strong> for your first matching.</p>
					<p>Please provide code when you send or recieve a match.</p><br>
					<a href="https://www.matchthecoach.com">MatchTheCoach</a><br>
					<p>Regards</p><br>
					<img src="cid:3@howto.mtc">`,
		attachments: [{
			filename: '3.png',
			path: './public/image/3.png',
			cid: '3@howto.mtc'
		}]
					 // body
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