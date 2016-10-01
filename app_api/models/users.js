var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
		identity: String,
		email: {
			type: String,
			unique: true,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		surname: {
			type: String,
			required: true
		},
		picture: String,
		memberSince: {
			type: Date,
			"default": Date.now
		},
		address: {
			type: String
		},
		telephone: {
			type: String,
			required: true
		},
		lineid: {
			type: String
		},
		education: {
			type: String
		},
		experience: String,
		idnumber: {
			type: Number
		},
		idcard: {
			type: Boolean
		},
		criminal: {
			type: Boolean
		},
		terms: {
			type: Boolean
		},
		requestToMatch: [{type: String}],
		course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coach' }]
		// reviews: [reviewSchema]
});

var reviewSchema = new mongoose.Schema({
    author: {type: String, required: true},
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: {type: String, required: true},
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

mongoose.model('User', userSchema);
mongoose.model('Review', reviewSchema);