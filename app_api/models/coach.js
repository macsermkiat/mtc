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
    level: String,
    videoid: String,
    picture: { data: Buffer, contentType: String }
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
    category : {type :String, unique: true},
    child : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coach' }]
});

// categorySchema.virtual('members', {
//     ref: 'Coach',
//     localField: 'cat',
//     foreignField: 'name'
// });

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var emailnewsletterSchema = new mongoose.Schema ({
    email: {type: String,
            trim: true,
            unique: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
            },   
    name: String  
});


// index
coachSchema.index({name:1, shortDescription:1}, {unique: true});

mongoose.model('Coach', coachSchema);
mongoose.model('Category', categorySchema);
mongoose.model('EmailNewsLetter', emailnewsletterSchema);