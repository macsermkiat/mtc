var mongoose = require('mongoose');
var Mtc = mongoose.model('Coach');
var Cat = mongoose.model('Category');
var User = mongoose.model('User');
var Mail = mongoose.model('EmailNewsLetter');
var async = require('async');
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

var theEarth = (function() {
  var earthRadius = 6371; // km, miles is 3959

  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

/* GET list of locations */
module.exports.coachesListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(maxDistance),
    num: 10
  };
  if ((!lng && lng!==0) || (!lat && lat!==0) || ! maxDistance) {
    console.log('coachesListByDistance missing params');
    sendJSONresponse(res, 404, {
      "message": "lng, lat and maxDistance query parameters are all required"
    });
    return;
  }
  Mtc.geoNear(point, geoOptions, function(err, results, stats) {
    var locations;
    console.log('Geo Results', results);
    console.log('Geo stats', stats);
    if (err) {
      console.log('geoNear error:', err);
      sendJSONresponse(res, 404, err);
    } else {
      coaches = buildCoachList(req, res, results, stats);
      sendJSONresponse(res, 200, locations);
    }
  });
};

var buildCoachList = function(req, res, results, stats) {
  var coaches = [];
  results.forEach(function(doc) {
    coaches.push({
      distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.name,
      subject: doc.obj.subject,
      shortDescription: doc.obj.shortDescription,
      courseDescription: doc.obj.courseDescription,
      preparation: doc.pbj.preparation,
      rating: doc.obj.rating,
      price: doc.obj.price,
      _id: doc.obj._id
    });
  });
  return coaches;
};

/* GET a coach by Browsing */
module.exports.coachesBrowse = function(req, res) {
  console.log('Browsing coaches');
    console.log('Finding coach by keyword', req.query);
      var typeaheadSearchBody = req.query.text;
  
    // .find({})
       
        // 
        Mtc
          .find({ $or:[{category: new RegExp (typeaheadSearchBody, "i")},
                       {name: new RegExp (typeaheadSearchBody, "i")},
                       {subject: new RegExp (typeaheadSearchBody, "i")},
                       {shortDescription: new RegExp (typeaheadSearchBody, "i")}] })
    .exec(function (err, coach) {
      if (!coach) {
          sendJSONresponse(res, 404, {
            "message": "coach not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        sendJSONresponse(res, 200, coach);
      });   
  
};

// GET category
module.exports.categorySearch = function(req, res) {
      var catSearchBody = req.query.text;
      Cat.find({ $or:[{category: new RegExp (catSearchBody, "i")}]}
        ).exec(function(err, catmember) {
         if (!catmember) {
                sendJSONresponse(res, 404, {
                "message": "Search not found"
                });
                return;
            } else if (err) {
              console.log(err);
              sendJSONresponse(res, 404, err);
              return;
            }
            sendJSONresponse(res, 200, catmember);
      });       
};

module.exports.allCats = function(req, res) {
      Cat.find({})
      .exec(function(err, catmember) {
         if (!catmember) {
                sendJSONresponse(res, 404, {
                "message": "Search not found"
                });
                return;
            } else if (err) {
              console.log(err);
              sendJSONresponse(res, 404, err);
              return;
            }
            sendJSONresponse(res, 200, catmember);
      });       
};


// GET coach by parent category
module.exports.keywordSearch = function(req, res, next) {
      console.log('Finding coach by keyword', req.query);
      var textSearchBody = req.query.text;

      if (req.query && req.query.text) {   
        
        Mtc
          .find({ $or:[{category: new RegExp (textSearchBody, "i")},
                       // {name: new RegExp (textSearchBody, "i")},
                       {subject: new RegExp (textSearchBody, "i")},
                       {shortDescription: new RegExp (textSearchBody, "i")}
                       ] 
                })
        // Cat.find({category: textSearchBody})
        //    .exec(function(err, courses) {
        //     var js = Array.from(courses[0].child);
        //     console.log(js+"js");
        //     js.forEach(function(course) {
        //       console.log(course+"course");
        //       Mtc.find({_id: course})
          .exec(function(err, coach) {
            var count = coach.length;
            if (!coach) {
                sendJSONresponse(res, 404, {
                "message": "Search not found"
                });
                return;
            } else if (err) {
              console.log(err);
              sendJSONresponse(res, 404, err);
              return;
            }
        sendJSONresponse(res, 200, coach);
        }); 
      } else {
        console.log('No Search specified');
        sendJSONresponse(res, 404, {
          "message": "No Search in request"
        });
      };
    
};
  

/* GET a coach by the id */
module.exports.coachesReadOne = function(req, res) {
  if (req.params && req.params.coachid) {
    Mtc
      .findById(req.params.coachid)
      .exec(function(err, coach) {
        if (!coach) {
          sendJSONresponse(res, 404, {
            "message": "coachid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log('Looking at coach: ' +coach.name + ', subject: ' + coach.shortDescription);
        sendJSONresponse(res, 200, coach);
      });
  } else {
    console.log('No coachid specified');
    sendJSONresponse(res, 404, {
      "message": "No coachid in request"
    });
  }
};

// GET User Courses
module.exports.usersCourse = function(req, res) {
      console.log('Get courses create by User');
      var id = req.query.id;
      Mtc.find({createdBy: id })
        .exec(function(err, course) {
         if (!course) {
                sendJSONresponse(res, 404, {
                "message": "Search not found"
                });
                return;
            } else if (err) {
              console.log(err);
              sendJSONresponse(res, 404, err);
              return;
            }
            console.log(course);
            sendJSONresponse(res, 200, course);
      });       
};

// GET User Bio
module.exports.usersBio = function(req, res) {
      // if (req.params && req.params.coachid)
      var id = req.params.id || req.params.userid;
      User.find({identity: id })
        .populate('course')
        .exec(function(error, bio) {
         if (!bio) {
                sendJSONresponse(res, 404, {
                "message": "Search not found"
                });
                return;
            } else if (error) {
              console.log(error);
              sendJSONresponse(res, 404, error);
              return;
            }
            // console.log('See User Bio: ' + bio[0].name);
            sendJSONresponse(res, 200, bio);
      });       
};


/* POST a new coach */
/* /api/coaches */
module.exports.coachesCreate = function(req, res) {
  console.log(req.body);
  var mtcSave = new Mtc({
    createdDate: req.body.createdDate,
    createdBy: req.body.createdBy,
    name: req.body.name,
    price: req.body.price,
    subject: req.body.subject,
    // coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    shortDescription: req.body.shortDescription,
    courseDescription: req.body.courseDescription,
    preparation: req.body.preparation,
    category: req.body.category,
    group: req.body.group,
    time: req.body.time,
    courseLength: req.body.courseLength,
    location: req.body.location,
    province: req.body.province,
    level: req.body.level,
    parent: req.body.parent,
    videoid: req.body.videoid,
    picture: req.body.pictureUrl 
  });

  
//   mtcSave.save(function(err, coach) {
//     if (err) {
//       console.log(err);
//       sendJSONresponse(res, 400, err);
//     } else {
//       console.log(mtcSave + "save done");
//       sendJSONresponse(res, 201, coach);
//     }

//   }).then(function(mtcSave) {

  
//   async.parallel ([
//     function(cb) {
//       // mtcSave.save(function (err){
//           var mtcId = mtcSave._id;
//           Mtc.findOneAndUpdate({ _id: mtcSave._id},
//                               {imageUrl: "https://s3-ap-southeast-1.amazonaws.com/matchthecoach/coaches/" + mtcSave.createdDate},
//                               {upsert:true, new:true}
//                               ,function(err, doc){
//                                 if (err) {
//                                   console.log(error);
//                                   return res.send(500, { error: err });
                                  
//                                 } else {
//                                   return res.send("succesfully add in CoachSchema");
//                                  }
//                                });   
//     // });
//     },      
//     function(cb) {       
//       Cat.findOne({ category: req.body.category })
//              .exec(function (err) {
//                 Cat.update({category: req.body.category},
//                 {$push: {child: mtcSave._id}},{upsert:true}
//                 ,function(err)   {
//                   if (err) {
//                     console.log(err);
//                   }else{
//                     console.log("Success add in CategorySchema");
//                   }
//                 })
//             });
//     },
//     function(cb) {       
//       User.findOne({ identity: req.body.createdBy })
//              .exec(function (err) {
//                 User.update({identity: req.body.createdBy},
//                 {$push: {course: mtcSave._id}},{upsert:true}
//                 ,function(err)   {
//                   if (err) {
//                     console.log(err);
//                   }else{
//                     console.log("Success add in UserSchema");
//                   }
//                 })
//             });
//     }
//   ], function(err, coach) {
//     if (err) {
//       console.log(err);
//       sendJSONresponse(res, 400, err);
//     } else {
//       console.log(coach + "save done");
//       sendJSONresponse(res, 201, coach);
//     }
//   }
//   )
// });
// };

    async.parallel ([
        function(cb) {
          mtcSave.save(function (err){
              var mtcId = mtcSave._id;
              Mtc.findOneAndUpdate({ _id: mtcSave._id},
                                  {imageUrl: "https://s3-ap-southeast-1.amazonaws.com/matchthecoach/coaches/" + mtcSave.createdDate},
                                  {upsert:true}
                                  ,function(err, doc){
                                    if (err) {
                                      console.log(error)
                                      return res.send(500, { error: err })
                                    } else {
                                      return res.send("succesfully add in CoachSchema");
                                     }
                                   });   
        });
        },      
        function(cb) {       
          Cat.findOne({ category: req.body.category })
                 .exec(function (err) {
                    Cat.update({category: req.body.category},
                    {$push: {child: mtcSave._id}},{upsert:true}
                    ,function(err)   {
                      if (err) {
                        console.log(err);
                      }else{
                        console.log("Success add in CategorySchema");
                      }
                    })
                });
        },
        function(cb) {       
          User.findOne({ identity: req.body.createdBy })
                 .exec(function (err) {
                    User.update({identity: req.body.createdBy},
                    {$push: {course: mtcSave._id}},{upsert:true}
                    ,function(err)   {
                      if (err) {
                        console.log(err);
                      }else{
                        console.log("Success add in UserSchema");
                      }
                    })
                });
        }
      ], function(err, coach) {
        if (err) {
          console.log(err);
          sendJSONresponse(res, 400, err);
        } else {
          console.log(coach + "save done");
          sendJSONresponse(res, 201, coach);
        }
      }
      )
    };
   
module.exports.usersCreate = function(req, res) {
  console.log(req.body);
  var mail = req.body.email;
  var userSave = new User({
    memberSince : req.body.memberSince,
    identity : req.body.identity,
    picture : req.body.picture,
    name : req.body.name,
    surname : req.body.surname,
    email : req.body.email,
    address : req.body.address,
    experience : req.body.experience,
    telephone : req.body.telephone,
    lineid : req.body.lineid,
    idnumber : req.body.idnumber,
    education: req.body.education,
    criminal : false,
    idcard: false,
    terms: req.body.terms,
    role: req.body.role
  });

  var sendEMail = function(req, res) {
    var mailOptions = {
       from: "matchthecoach@royyak.com", // sender address.  Must be the same as authenticated user if using Gmail.
       to: mail, // receiver
       subject: "Welcome to MatchTheCoach", // subject
       html: `<h2 style='color: #006600'>Welcome to MatchTheCoach</h2>
              <p>If you are having any issues with your account, please don't hesitate to contact us by replying to this mail.</p>
              <p>Apart from E-mail, you can reach me easily in one of these channels.</p>
              <p>- facebook : <a href="https://www.facebook.com/matchTcoach">matchTcoach</a></p>
              <p>- <a href="https://line.me/R/ti/p/%40gpp9462v">LINE</a> : @gpp9462v (need '@')</p>
              <p>Please feel free to ask anything or any advice, whether you're a coach, or student, or parents.</p>
              <p>I'm here to help.</p>
              <br>
              <p>ยินดีต้อนรับสู่ <strong>MatchTheCoach</strong> ครับ</p>
              <p>ถ้ามีปัญหาการใช้งานหรือคำถามอะไร หรือต้องการคำแนะนำ คุณสามารถตอบกลับ Email ฉบับนี้ได้เลย</p>
              <p>หรือจะใช้ช่องทางการสื่อสารอื่นๆก็ได้</p>
              <p>- facebook : <a href="https://www.facebook.com/matchTcoach">matchTcoach</a></p>
              <p>- <a href="https://line.me/R/ti/p/%40gpp9462v">LINE</a> : @gpp9462v (ต้องมี '@')</p>
              <p>ไม่ว่าคุณจะเป็นติวเตอร์ หรือครู หรือจะเป็นนักเรียนหรือผู้ปกครองที่อยากจะหาครูให้บุตรหลาน</p>
              <p>สามารถติดต่อสอบถามได้ตลอดครับ </p>
              <br>
              <p>Thanks,</p>
              <p>Sermkiat</p>
              <p>Director</p>
             <hr>
              <div id="WISESTAMP_SIG_22e21843e5bf46e433fdcc778ada4935" href="http://WISESTAMP_SIG_22e21843e5bf46e433fdcc778ada4935"><div><div style="max-width:600px;  direction: ltr; " class="main_html date__2016_11_21___15_30"><div class="html wisestamp_app main_sig" id="tp1s" style="max-width: 485px;"> <table border="0" cellspacing="0" cellpadding="0" width="485" style="width: 485px;"> <tbody><tr valign="top"> <td style="width: 10px; padding-right:10px;"> <img src="https://s3.amazonaws.com/ucwebapp.wisestamp.com/94a44911-1bc0-468c-86ba-40fc7dedbeba/14690951_1667850066877578_4424.format_png.resize_200x.png#logo" width="65" height="65" alt="photo" style="border-radius:4px;moz-border-radius:4px;khtml-border-radius:4px;o-border-radius:4px;webkit-border-radius:4px;ms-border-radius: 4px;width:65px;height:65px;max-width: 120px;"> </td> <td style="border-right: 1px solid #C01A5C;"></td> <td style="display: inline-block; text-align:initial; font:12px Arial;color:#646464;padding:0 10px"> <table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td> <b class="text-color theme-font">Sermkiat</b><br> <span style="display: inline-block;">Director</span>, <span style="display: inline-block;">Royyak Co.,Ltd</span> </td> </tr> <tr> <td style="color:#8d8d8d;font-size:12px;padding:5px 0"> <span style="display:inline-block;"><a href="mailto:matchthecoach@royyak.com" style="display: inline-block; color:#8d8d8d;text-decoration: none;">matchthecoach@royyak.com</a></span>  <span style="color: #C01A5C;display:inline-block;">|</span> <span style="white-space: nowrap;display:inline-block;"><a href="https://www.matchthecoach.com" rel="nofollow" target="_blank" style="display: inline-block; color:#8d8d8d;text-decoration: none;">https://www.matchthecoach.com</a></span> </td> </tr> <tr> <td style="margin-top: 5px"><a href="http://facebook.com/matchTcoach" target="_blank"><img style="border-radius:0;moz-border-radius:0;khtml-border-radius:0;o-border-radius:0;webkit-border-radius:0;ms-border-radius:0;border: 0;width:16px; height:16px;" width="16" height="16" src="https://s3.amazonaws.com/images.wisestamp.com/icons_32/facebook.png"></a>&nbsp;<a href="http://instagram.com/matchthecoach" target="_blank"><img style="border-radius:0;moz-border-radius:0;khtml-border-radius:0;o-border-radius:0;webkit-border-radius:0;ms-border-radius:0;border: 0;width:16px; height:16px;" width="16" height="16" src="https://s3.amazonaws.com/images.wisestamp.com/icons_32/instagram.png"></a></td> </tr> </tbody></table> </td> </tr> </tbody></table> </div><div style="clear:both;height:0!important"></div><a class="wisestamp_app facebook_button" style="margin:8px 8px 0 0;display: inline-block;vertical-align: bottom;" href="https://www.facebook.com/matchTcoach" target="_blank"><img src="https://s3.amazonaws.com/images.wisestamp.com/apps/facebook_like.png"></a><div href="http://WS_promo" id="WS_promo" style="width: auto; padding-top: 2px; font-size: 10px; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(238, 238, 238); margin-top: 10px;display:table; direction: ltr; line-height: normal; border-spacing: initial;"> <img src="http://ws-promos.appspot.com/ga/pixel.png?dont_count=1&amp;e=5732568548769792" style="display:block"> <div class="promo-placeholder" style="padding-top:2px;"> </div> </div></div></div></div>
             `           
      };

      transporter.sendMail(mailOptions, function(error, info){  //callback
         if(error){
             console.log(error);
             return sendJSONresponse(res, 404, error);
         }else{
             console.log("Welcome message sent to " + req.body.email + " : " + info.response);
         }
             // return sendJSONresponse(res, 200, info);

      });
   };   

   setTimeout(function() {
     async.parallel ([       
      function(cb) {
         sendEMail(req, res), function(err)   {
                            if (err) {
                              console.log(err);  
                            }else{
                              console.log("Success send Email");
                            }
        }; 
      }, function(cb) {
        userSave.save(function(err, user) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
          } else {
            console.log(user + "save done");
            sendJSONresponse(res, 201, user);
          }

          });
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

// Update User
module.exports.usersUpdate = function(req, res) {
  if (!req.body.identity) {
    sendJSONresponse(res, 404, {
      "message": "Not found, User ID is required"
    });
    return;
  }
  User
    .findOneAndUpdate({identity: req.body.identity},{$set:{
        "name" : req.body.name,
        "surname" : req.body.surname,
        "email" : req.body.email,
        "address" : req.body.address,
        "experience" : req.body.experience,
        "telephone" : req.body.telephone,
        "lineid" : req.body.lineid,
        "idnumber" : req.body.idnumber,
        "education" : req.body.education,
        "term" : req.body.term
    }
    }, function(err, user) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, user);
          }
        }
    );
  };


/* PUT /api/coaches/:coachid */
module.exports.coachesUpdateOne = function(req, res) {
  if (!req.body.coachid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, coachid is required"
    });
    return;
  }
  
  async.parallel ([
        function(cb) {
          Mtc
            .findOneAndUpdate({ _id : req.body.coachid },{$set:{
                "name" : req.body.name,
                "imageUrl" : req.body.imageUrl,
                "price" : req.body.price,
                "subject" : req.body.subject,
                "group" : req.body.group,
                "time" : req.body.time,
                "courseLength" : req.body.courseLength,
                "level" : req.body.level,
                "category" : req.body.category,
            // coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
                "shortDescription" : req.body.shortDescription,
                "courseDescription" : req.body.courseDescription,
                "preparation" : req.body.preparation,
                "location" : req.body.location,
                "province" : req.body.province,
                "videoid" : req.body.videoid
                }
            }, {new: true}, function(err, user) {
                  if (err) {
                    sendJSONresponse(res, 404, err);
                  } else {
                    sendJSONresponse(res, 200, user);
                  }
                }
            );
  }, function(cb) {
        Cat.findOneAndUpdate({ category: req.body.category },{$push:{
                child: req.body.coachid}},{upsert:true}
                ,function(err)   {
                  if (err) {
                    console.log(err);
                  }else{
                    console.log("Success add in CategorySchema");
                  }
          });

  }, function(cb) {
        Cat.findOneAndUpdate({ category: req.body.oldCategory },{$pull:{
                child: req.body.coachid}}
                ,function(err)   {
                  if (err) {
                    console.log(err);
                  }else{
                    console.log("Success Remove id from oldCategory");
                  }
                });
  }
  ], function(err, coach) {
        if (err) {
          console.log(err);
          sendJSONresponse(res, 400, err);
        } else {
          console.log(coach + "save done");
          sendJSONresponse(res, 201, coach);
        }
      }
      )
  };

/* DELETE /api/coaches/:coachid */
module.exports.coachesDeleteOne = function(req, res) {
  var coachid = req.params.coachid;
  if (coachid) {
    Mtc
      .findByIdAndRemove(coachid)
      .exec(
        function(err, coach) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log("Coach id " + coachid + " deleted");
          sendJSONresponse(res, 204, null);
        }
    );
  } else {
    sendJSONresponse(res, 404, {
      "message": "No coachid"
    });
  }
};

// Email NewsLetter

module.exports.eMailNewsLetterCollect = function(req, res) {
  console.log('New Email for NewsLetter: ' + req.body);
  var checkExistingMail = req.body.email;
  console.log(checkExistingMail);
  var mailSave = new Mail({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
      });
  mailSave.save(function (err, mail){
   if (err) {
      console.log('Saving:', err);
      sendJSONresponse(res, 404, err);
    } else {
      console.log(mail);
      sendJSONresponse(res, 201, mail);
    }
  });  
};
          