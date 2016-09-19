var mongoose = require('mongoose');
var Mtc = mongoose.model('Coach');
var Cat = mongoose.model('Category');
var User = mongoose.model('User');
var Mail = mongoose.model('EmailNewsLetter');
var async = require('async');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

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
      console.log(typeaheadSearchBody);
  
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
        console.log(coach);
        sendJSONresponse(res, 200, coach);
      });   
  
};

// GET category
module.exports.categorySearch = function(req, res) {
      console.log('Browsinging category');
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
            console.log(catmember);
            sendJSONresponse(res, 200, catmember);
      });       
};



// GET coach by parent category
module.exports.keywordSearch = function(req, res, next) {
      console.log('Finding coach by keyword', req.query);
      var textSearchBody = req.query.text;
      console.log(textSearchBody);

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
        console.log(coach+"coach");
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
  console.log('Finding coach details', req.params);
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
        console.log(coach);
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
      console.log('Get User Bio');
      var id = req.query.id;
      User.find({identity: id })
        .exec(function(err, bio) {
         if (!bio) {
                sendJSONresponse(res, 404, {
                "message": "Search not found"
                });
                return;
            } else if (err) {
              console.log(err);
              sendJSONresponse(res, 404, err);
              return;
            }
            console.log(bio);
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
    level: req.body.level,
    parent: req.body.parent,
    videoid: req.body.videoid,
    picture: req.body.pictureUrl 
  });

  async.parallel ([
    function(cb) {
      mtcSave.save(function (err){
          var mtcId = mtcSave._id;
          Mtc.findOneAndUpdate({ _id: mtcSave._id},
                              {imageUrl: "https://s3-ap-southeast-1.amazonaws.com/matchthecoach/" + mtcSave.createdDate},
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
    term: req.body.term
  });

  userSave.save(function(err, user) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(user + "save done");
      sendJSONresponse(res, 201, user);
    }

    });
  
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
    .findOne({identity: req.body.identity})
    .exec(
      function(err, user) {
        if (!user) {
          sendJSONresponse(res, 404, {
            "message": "User id not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        user.name = req.body.name,
        user.surname = req.body.surname,
        user.email = req.body.email,
        user.address = req.body.address,
        user.experience = req.body.experience,
        user.telephone = req.body.telephone,
        user.lineid = req.body.lineid,
        user.idnumber = req.body.idnumber,
        user.education = req.body.education,
        user.term = req.body.term;
        user.save(function(err, user) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, user);
          }
        });
      }
  );
};


/* PUT /api/coaches/:coachid */
module.exports.coachesUpdateOne = function(req, res) {
  if (!req.params.coachid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, coachid is required"
    });
    return;
  }
  Mtc
    .findById(req.params.coachid)
    .select('-reviews -rating')
    .exec(
      function(err, coach) {
        if (!coach) {
          sendJSONresponse(res, 404, {
            "message": "coachid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        coach.name = req.body.name;
        coach.price = req.body.price;
        coach.subject = req.body.subject;
        coach.group = req.body.group;
        coach.time = req.body.time;
        coach.courseLength = req.body.courseLength;
        coach.level = req.body.level;
    // coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        coach.shortDescription = req.body.shortDescription;
        coach.courseDescription = req.body.courseDescription;
        coach.preparation = req.body.preparation;
        coach.save(function(err, coach) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, coach);
          }
        });
      }
  );
};

/* DELETE /api/coaches/:coachid */
module.exports.coachesDeleteOne = function(req, res) {
  var coachid = req.params.coachid;
  if (coachid) {
    Mtc
      .findByIdAndRemove(coachid)
      .exec(
        function(err, location) {
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
        email: req.body.email
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
          