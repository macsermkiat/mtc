var mongoose = require('mongoose');

var coachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    price: Number,
    rating: {
        type: Number,
        "default": 0,
        min: 0,
        max: 5
    },
    shortDescription: {
        type: String,
        required: true
    },
    courseDescription: String,
    preparation: String,
    group: String,
    time: String,
    location: String,
    courseLength: String,
    level: String
    // category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]

    // Always store coordinates longitude, latitude order.
    // coords: {
    //     type: [Number],
    //     index: '2dsphere'
    // },
    // openingTimes: [openingTimeSchema],
    // reviews: [reviewSchema]
});

var categorySchema = new mongoose.Schema ({
    category : String,
    child : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coach' }]
});

// categorySchema.virtual('members', {
//     ref: 'Coach',
//     localField: 'cat',
//     foreignField: 'name'
// });


mongoose.model('Coach', coachSchema);
mongoose.model('Category', categorySchema);