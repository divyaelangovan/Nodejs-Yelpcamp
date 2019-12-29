var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//=================
	//comments route
//=================


//comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find campground ByID
	console.log(req.params.id);
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});

		}
	});
	
});

//comments create

router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
					req.flash("error", "Something went wrong");
				} else {
					//add username and id to comment
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				//save comment
				comment.save();
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					console.log("comment");
					//redirect to campground show page
					req.flash("Success", "Successfully added comment");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.render("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//Comment update route
router.put("/:comment_id", middleware.checkCommentOwnership,  function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY Route
router.delete("/:comment_id", middleware.checkCommentOwnership,  function(req, res){
	//find by ID and remove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;
