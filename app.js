var express       = require("express"),
	app           = express(),
	bodyParser    = require("body-parser"),
	mongoose 	  = require("mongoose"),
	passport 	  = require("passport"),
	flash 		  = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comment"),
	User 		  = require("./models/user"),
	seedDB 		  = require("./seeds")

//requring routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp_v12", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);
app.use(flash());
//seedDB(); 

//PASSPORT CONFIGURE
app.use(require("express-session")({
 secret: "the code you want it can be anything",
 resave: false,
 saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // importing passport local strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to call particular links like signin, login, logout(show and hide links)
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(3000, function(){
	console.log("Yelpcamp started");
});