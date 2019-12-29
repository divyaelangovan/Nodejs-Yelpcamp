var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX -GET- Display a list o all campground
router.get("/", function(req, res){
	//Get all campground from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
//res.render("campgrounds", {campgrounds : campgrounds});

});

//CREATE - POST- Add new campground to db

router.post("/", middleware.isLoggedIn, function(req, res){
//get data from form and add to campgrounds array
var name = req.body.name;
var image = req.body.image;
var description = req.body.description;
var author = {
	id: req.user._id,
	username: req.user.username
}
//to push data to campground, creating object
var newCampground = {name : name, image: image, description: description, author: author}
//create new campground and save it to DB
Campground.create(newCampground, function(err, newlyCreated){
	if(err){
		console.log(err);
	} else {
		//redirect back to campgrounds page
		res.redirect("/campgrounds");
	}
});


});

//NEW - GET - Displays form to make a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW -GET- shows more info about one campground
router.get("/:id",  function(req, res){
//find campground with provided ID
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
	if(err){
		console.log(err);
	} else {
		console.log(foundCampground);
		// render show template with that campground
 		res.render("campgrounds/show", {campground: foundCampground});
	}
});

});

//EDIT Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
					res.render("campgrounds/edit", {campground: foundCampground});	
	});	
});

//Update Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find correct id and update
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Destro Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});




module.exports = router;
