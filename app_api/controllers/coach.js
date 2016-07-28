var mongoose = require('mongoose');
var Mtc = mongoose.model('Coach');

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
      rating: doc.obj.rating,
      price: doc.obj.price,
      _id: doc.obj._id
    });
  });
  return coaches;
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