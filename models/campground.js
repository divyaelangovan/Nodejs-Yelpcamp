var mongoose = require("mongoose");
//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	//for automatically adding author name in campground
	author: {
		id: {
			type : mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},

	comments: [{   //=======adding comment 
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

module.exports = mongoose.model("Campground", campgroundSchema);