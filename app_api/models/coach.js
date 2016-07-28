var mongoose = require('mongoose');

var coachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subject: [String],
    price: Number,
    rating: {
        type: Number,
        "default": 0,
        min: 0,
        max: 5
    },
    shortDescription:String,
    courseDescription: String,
    preparation: [String],
    // Always store coordinates longitude, latitude order.
    coords: {
        type: [Number],
        index: '2dsphere'
    },
    // openingTimes: [openingTimeSchema],
    // reviews: [reviewSchema]
});

mongoose.model('Coach', coachSchema);