var mongoose = require('mongoose');
var Mtc = mongoose.model('Coach');
var Cat = mongoose.model('Category');

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
  Mtc
    .find({})
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

// GET coach by parent category
module.exports.coachesParent = function(req, res) {
    Cat
      .find({})
      .populate('members')
      .exec(function (err, names) {
         if (!names) {
          sendJSONresponse(res, 404, {
            "message": "coach not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(names);
        sendJSONresponse(res, 200, names);
      });    
};

/* GET a location by the id */
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

/* POST a new coach */
/* /api/coaches */
module.exports.coachesCreate = function(req, res) {
  console.log(req.body);
  Mtc.save({
    name: req.body.name,
    price: req.body.price,
    subject: req.body.subject,
    // coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    shortDescription: req.body.shortDescription,
    courseDescription: req.body.courseDescription,
    preparation: req.body.preparation,
    group: req.body.group,
    time: req.body.time,
    courseLength: req.body.courseLength,
    level: req.body.level,
    parent: req.body.parent
  }, function(err, coach) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(coach);
      sendJSONresponse(res, 201, coach);
    }
  });

  Cat.create({
    category: req.body.category,
    child: req.body.shortDescription
  });

  Cat
    .findOne({ category: req.body.category })
    .populate('child')
    .exec(function (err, cat) {
      if (err) return handleError(err);
      console.log('The child is %s', cat.child.name);
    });
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
