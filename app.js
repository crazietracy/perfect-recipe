var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var Recipe = require("./models/recipes");
var Comment     = require("./models/comment");
var User        = require("./models/user");
var seedDB      = require("./seed");

var mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override");


var commentRoutes    = require("./routes/comments"),
    recipeRoutes = require("./routes/recipes"),
    indexRoutes      = require("./routes/index")



mongoose.connect('mongodb+srv://goormide:tina1995@cluster0-q1i8o.azure.mongodb.net/test?retryWrites=true&w=majority', { 
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("good")
}).catch(err => {
	console.log(err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();


app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});



app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function(){
	console.log("PrefectRecipes is started!");
});





app.get("/recipes/:id", function(req, res){
	Recipe.findById(req.params.id, function(err, foundRecipe){
		if (err){
			console.log('nothing is found');
		} else {
			res.render("show", {recipe: foundRecipe});
		}
	})
});








